import './index.less';

import { LockOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons';
import type { CheckboxProps } from 'antd';
import { Button, Form, Input, Checkbox } from 'antd';

import { FC, useEffect, useState } from 'react';

import { getCode, login } from '@/api/login';
// import { userStore } from '@/stores/user';
import { useNavigate, useLocation, Location } from 'react-router-dom';

const initialValues: API.LoginParams = {
  username: 'admin',
  password: '123456',
  captchaId: '',
  verifyCode: ''
  // remember: true
};

const LoginForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as Location<{ from: string }>;
  const [capatcha, setCapatcha] = useState<API.CaptChaResult>({
    id: '',
    img: ''
  });
  const [checked, setChecked] = useState<boolean>(false);
  const getCapatcha = async (e?: React.MouseEvent<HTMLImageElement>) => {
    e?.preventDefault();
    const data = await getCode();
    setCapatcha(data);
  };
  const onChange: CheckboxProps['onChange'] = e => {
    console.log(`checked = ${e.target.checked}`);
    setChecked(e.target.checked);
  };
  useEffect(() => {
    getCapatcha();
  }, []);

  /**
   * 表单验证成功回调
   * @param form
   */
  const onFinished = async (form: API.LoginParams) => {
    console.log('LoginParams', form);
    form.captchaId = capatcha.id;
    // const res = await userStore.login(form);
    // console.log('登录结果：', res);
    // if (Object.is(res, false)) {
    //   return getCapatcha();
    // }
    const { token } = await login(form);
    console.log(token);
    const search = new URLSearchParams(location.search);

    const from = location.state?.from || search.get('from') || { pathname: '/dashboard' };
    navigate(from, { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-page-box">
        <div className="login-page-box-img"></div>
        <Form<API.LoginParams> onFinish={onFinished} className="login-page-box-form" initialValues={initialValues}>
          <h2>欢迎登录家教管理后台</h2>
          <Form.Item
            name="username"
            className="login-page-box-form_input"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input placeholder="用户名" prefix={<UserOutlined />} size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            className="login-page-box-form_input"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password placeholder="密码" prefix={<LockOutlined />} size="large" />
          </Form.Item>
          <Form.Item
            name="verifyCode"
            className="login-page-box-form_input"
            rules={[{ required: true, message: '请输入密码！' }]}
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
          <Checkbox onChange={onChange}>记住密码</Checkbox>
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
