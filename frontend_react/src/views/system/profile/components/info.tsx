import { FC, useState, useRef, useEffect, useCallback } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Form, Input, Upload, Tag, message, Button, Avatar } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store';
import { avatarUrl, updateUserProfile } from '@/store/module/login';
import { getAccount, updateAccount, uploadAvatar } from '@/api/account';
import { uploadUserAvatar } from '@/store/module/login';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
const Info: FC = () => {
  const headImg = useAppSelector(avatarUrl);
  const dispatch = useAppDispatch();
  const [imageUrl, setImageUrl] = useState<string>(headImg);
  const formRef = useRef<any>();
  const [accountInfo, setAccountInfo] = useState<any>();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const getAccountInfo = useCallback(async () => {
    const res = await getAccount();
    setAccountInfo(res);
  }, []);
  useEffect(() => {
    getAccountInfo();
  }, [getAccountInfo]);
  useEffect(() => {
    form.setFieldsValue(accountInfo);
  });
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
      message.error('你只能上传jepg和png格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2M');
    }
    return isJpgOrPng && isLt2M;
  };
  const handleOk = async () => {
    try {
      formRef.current?.validateFields().then(async (submitInfo: any) => {
        const { code } = await updateAccount({ id: accountInfo.id, ...submitInfo });

        code === 200 ? messageApi.success('更新成功') : messageApi.error('更新失败');
        const res = await getAccount();
        console.log(res);
        dispatch(updateUserProfile(res));
      });
    } catch (err: any) {
      messageApi.error(err);
    }
  };

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      getBase64(info.file.originFileObj as RcFile, url => {
        setImageUrl(url);
      });
    }
  };
  const uploadFile = async (file: any) => {
    const { url } = await uploadAvatar(file);
    if (url) {
      messageApi.success('上传成功');
      setImageUrl(url);
      dispatch(uploadUserAvatar(url));
    } else {
      messageApi.error('上传失败');
    }
  };
  return (
    <div className="info_profile">
      {contextHolder}
      <div className="info_form">
        <div className="setting">基本设置</div>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
          form={form}
          ref={formRef}
        >
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ pattern: /^\w+(-+.\w+)*@\w+(-.\w+)*.\w+(-.\w+)*$/, message: '邮箱格式错误' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="昵称"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名'
              },
              {
                pattern: /^[0-9a-zA-z]{6,15}$/,
                message: '用户名格式错误'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="姓名"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入姓名'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="电话号码"
            name="phone"
            rules={[
              {
                pattern: /^1[3456789]\d{9}$/,
                message: '电话号码格式错误'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="角色">
            {accountInfo?.role?.map((item: string, index: number) => {
              return (
                <Tag key={index} color="blue">
                  {item}
                </Tag>
              );
            })}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleOk} ghost className="btn">
              更新资料
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="info_upload">
        <div className="avatar_name">
          <div className="title">头像</div>
          <Avatar src={imageUrl} size={{ xs: 30, sm: 42, md: 60, lg: 80, xl: 120, xxl: 140 }} />
        </div>
        <Upload showUploadList={false} onChange={handleChange} beforeUpload={beforeUpload} customRequest={uploadFile}>
          <Button icon={<UploadOutlined />} className="avatarBtn">
            更换头像
          </Button>
        </Upload>
      </div>
    </div>
  );
};
export default Info;
