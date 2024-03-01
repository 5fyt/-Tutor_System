import { FC, useRef } from 'react';
import { Button, Form, Input, message } from 'antd';
import { updatePassword } from '@/api/account';

type FieldType = {
  originPassword?: string;
  newPassword?: string;
};
const Account: FC = () => {
  const [form] = Form.useForm();
  const formRef = useRef<any>();
  const [messageApi, contextHolder] = message.useMessage();
  const sumbitHandle = async () => {
    try {
      formRef.current?.validateFields().then(async (submitInfo: any) => {
        const { code } = await updatePassword(submitInfo);
        code === 200 ? messageApi.success('修改成功') : messageApi.error('修改失败');
      });
    } catch (err: any) {
      console.log(err);
      messageApi.error(err);
    }
  };
  return (
    <>
      {contextHolder}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        form={form}
        ref={formRef}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="旧密码"
          name="originPassword"
          rules={[
            { required: true, message: '请输入新密码' },
            { pattern: /^(?=.*\d).{1,9}$/, message: '密码格式错误' }
          ]}
        >
          <Input.Password placeholder="请输入旧密码" />
        </Form.Item>

        <Form.Item<FieldType>
          label="新密码"
          name="newPassword"
          rules={[
            { required: true, message: '请输入新密码' },
            { pattern: /^(?=.*\d).{1,9}$/, message: '密码格式错误' }
          ]}
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" onClick={sumbitHandle}>
            更改密码
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default Account;
