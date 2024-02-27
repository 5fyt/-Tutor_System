import { FC, memo, Ref, useImperativeHandle, useState, useRef } from 'react';
import { Form, Input, Modal, message, Select, SelectProps } from 'antd';
import { addUser } from '@/api/system/user';

type FieldType = {
  username: string;
  phone: string;
  email: string;
  roles: number[];
  name: string;
};

interface ModalProps {
  innerRef: Ref<{ showModal: () => void }>;
  onLoadList: (value?: any) => void;
  roleOptions: SelectProps['options'];
}

const AddUser: FC<ModalProps> = ({ innerRef, roleOptions, onLoadList }) => {
  const [visible, setVisible] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const formRef = useRef<any>();
  //将子组件上的方法暴露给父组件，类型于Vue中defineExpose({})
  useImperativeHandle(innerRef, () => ({
    showModal
  }));

  const handleChange = (value: string | string[]) => {
    console.log(`Selected: ${value}`);
  };

  const handleOk = async () => {
    try {
      const submitInfo = await formRef.current?.validateFields();
      const filterRoles = submitInfo.roles.map((item: string) => Number(item));
      await addUser({ ...submitInfo, roles: filterRoles });
      messageApi.success('添加成功');
      onLoadList();
      setTimeout(() => {
        setVisible(false);
      }, 1000);
      formRef.current?.resetFields();
    } catch (err: any) {
      messageApi.error(err);
    }
  };
  const showModal = () => {
    setVisible(true);
  };

  return (
    <>
      {contextHolder}
      <Modal title="添加用户" centered open={visible} onOk={handleOk} onCancel={() => setVisible(false)}>
        <Form
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          ref={formRef}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="用户名"
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
            <Input placeholder="请输入六位用户名" />
          </Form.Item>
          <Form.Item<FieldType>
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
          <Form.Item<FieldType>
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
          <Form.Item<FieldType>
            label="邮箱"
            name="email"
            rules={[{ pattern: /^\w+(-+.\w+)*@\w+(-.\w+)*.\w+(-.\w+)*$/, message: '邮箱格式错误' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色"
            name="roles"
            rules={[
              {
                required: true,
                message: '请选择角色'
              }
            ]}
          >
            <Select mode="tags" placeholder="请选择" onChange={handleChange} options={roleOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default memo(AddUser);
