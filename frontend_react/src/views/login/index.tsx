import './index.less';

import { LockOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons';
import type { CheckboxProps } from 'antd';
import { Button, Form, Input, Checkbox, message } from 'antd';

import { FC, useEffect, useRef, useState } from 'react';

import { getCode } from '@/api/login';
// import { userStore } from '@/stores/user';
import { useNavigate, useLocation, Location } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { afterLogin, loginUser } from '@/store/module/login';
import Storage from '@/utils/Storage';
import { ACCESS_TOKEN_KEY, ACCESS_PASSWORD_KEY, ACCESS_USER_KEY } from '@/enums/cacheEnum';
import { AESCipher } from '@/utils/aes';

const initialValues: API.LoginParams = {
  username: '',
  password: '',
  captchaId: '',
  verifyCode: ''
  // remember: true
};

const LoginForm: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation() as Location<{ from: string }>;
  const [capatcha, setCapatcha] = useState<API.CaptChaResult>({
    id: '',
    img: ''
  });
  const [checked, setChecked] = useState<boolean>(false);
  const formRef = useRef<any>();
  const getCapatcha = async (e?: React.MouseEvent<HTMLImageElement>) => {
    e?.preventDefault();
    const data = await getCode();
    setCapatcha(data);
  };
  const onChange: CheckboxProps['onChange'] = e => {
    setChecked(e.target.checked);
  };
  useEffect(() => {
    getCapatcha();
  }, []);
  useEffect(() => {
    const aseCipher = new AESCipher(import.meta.env.VITE_PASSWORD_KEY);
    const passsword = aseCipher.decrypt(Storage.get(ACCESS_PASSWORD_KEY) || '');
    const username = aseCipher.decrypt(Storage.get(ACCESS_USER_KEY) || '');
    if (passsword && username) {
      setChecked(true);
      formRef.current?.setFieldsValue({ password: passsword, username: username });
    }
  }, []);

  /**
   * 表单验证成功回调
   * @param form
   */
  const onFinished = async (form: API.LoginParams) => {
    form.captchaId = capatcha.id;
    await dispatch(loginUser(form));
    await dispatch(afterLogin());
    if (checked) {
      const aseCipher = new AESCipher(import.meta.env.VITE_PASSWORD_KEY);
      const password = aseCipher.encrypt(form.password);
      const username = aseCipher.encrypt(form.username);
      Storage.set(ACCESS_PASSWORD_KEY, password);
      Storage.set(ACCESS_USER_KEY, username);
    } else {
      Storage.remove(ACCESS_PASSWORD_KEY);
      Storage.remove(ACCESS_USER_KEY);
    }
    const token = Storage.get(ACCESS_TOKEN_KEY, null);
    const search = new URLSearchParams(location.search);
    const from = location.state?.from || search.get('from') || { pathname: '/dashboard' };

    if (token) {
      const defaultLoginSuccessMessage = '登录成功！';
      await messageApi
        .open({
          type: 'loading',
          content: '正在登入',
          duration: 1
        })
        .then(() => messageApi.success(defaultLoginSuccessMessage, 1))
        .then(() => {
          navigate(from, { replace: true });
        });
    } else {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      await messageApi.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-box">
        <div className="login-page-box-img"></div>
        {contextHolder}
        <Form<API.LoginParams>
          onFinish={onFinished}
          className="login-page-box-form"
          ref={formRef}
          initialValues={initialValues}
        >
          <h2>欢迎登录家教管理后台</h2>
          <Form.Item
            name="username"
            className="login-page-box-form_input"
            rules={[
              { required: true, message: '请输入用户名！' },
              { pattern: /^[a-zA-Z0-9_-]{4,16}$/, message: '用户名格式错误！' }
            ]}
          >
            <Input autoComplete="off" placeholder="用户名" prefix={<UserOutlined />} size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            className="login-page-box-form_input"
            rules={[
              { required: true, message: '请输入密码！' },
              { pattern: /^[a-zA-Z0-9_-]{6,18}$/, message: '密码格式错误！' }
            ]}
          >
            <Input.Password autoComplete="off" placeholder="密码" prefix={<LockOutlined />} size="large" />
          </Form.Item>
          <Form.Item
            name="verifyCode"
            className="login-page-box-form_input"
            rules={[{ required: true, message: '请输入验证码！' }]}
          >
            <Input
              placeholder="验证码"
              prefix={<SafetyOutlined />}
              size="large"
              autoComplete="off"
              maxLength={4}
              suffix={
                <img src={capatcha.img} onClick={getCapatcha} className="login-page-box-form_capatcha" alt="验证码" />
              }
            />
          </Form.Item>
          <Checkbox onChange={onChange} checked={checked}>
            记住密码
          </Checkbox>
          <Form.Item>
            <Button htmlType="submit" type="primary" className="login-page-box-form_button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
