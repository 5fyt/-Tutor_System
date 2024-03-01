import { FC, memo, Ref, useImperativeHandle, useState, useRef } from 'react';
import { Form, Input, Modal, Button, message, Select, SelectProps } from 'antd';
import { addUser, updateUser } from '@/api/system/user';

type FieldType = {
  username: string;
  password: string;
  phone: string;
  email: string;
  roles: number[];
  name: string;
};

interface ModalProps {
  innerRef: Ref<{ showModal: (value?: any) => void }>;
  onLoadList: (value?: any) => void;
  roleOptions: SelectProps['options'];
}

const AddUser: FC<ModalProps> = ({ innerRef, roleOptions, onLoadList }) => {
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<number>();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const formRef = useRef<any>();
  //将子组件上的方法暴露给父组件，类型于Vue中defineExpose({})
  useImperativeHandle(innerRef, () => ({
    showModal
  }));

  const handleChange = (value: string | string[]) => {
    console.log(`Selected: ${value}`);
  };

  const handleOk = () => {
    try {
      formRef.current?.validateFields().then(async (submitInfo: any) => {
        const filterRoles = submitInfo.roles.map((item: string) => Number(item));
        if (id) {
          console.log({ id, ...submitInfo, roles: filterRoles });
          const { code } = await updateUser({ id, ...submitInfo, roles: filterRoles });
          if (code === 200) {
            messageApi.success('更新成功');
            onLoadList();
            setTimeout(() => {
              setVisible(false);
              setId(0);
              formRef.current?.resetFields();
            }, 100);
          } else {
            messageApi.error('更新失败');
          }
        } else {
          const { code } = await addUser({ ...submitInfo, roles: filterRoles });
          if (code === 200) {
            messageApi.success('添加成功');
            onLoadList();
            setTimeout(() => {
              setVisible(false);
              formRef.current?.resetFields();
            }, 100);
          } else {
            messageApi.error('添加失败');
          }
        }
      });
    } catch (err: any) {
      messageApi.error(err);
    }
  };
  const cancelHandle = () => {
    setVisible(false);
    formRef.current?.resetFields();
  };
  const showModal = (value?: any) => {
    if (value) {
      const { roleNames, id } = value;
      setId(id);
      const roles: number[] = [];
      roleOptions?.forEach((item: any) => {
        roleNames.forEach((role: string) => {
          if (role === item.label) {
            roles.push(item.value);
          }
        });
      });
      form.setFieldsValue({ ...value, roles });
    }

    setVisible(true);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={id ? '修改' : '新增'}
        centered
        open={visible}
        onOk={handleOk}
        onCancel={cancelHandle}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
          <Button key="link" type="primary" onClick={cancelHandle}>
            取消
          </Button>
        ]}
      >
        <Form
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          ref={formRef}
          form={form}
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
          {id && (
            <Form.Item<FieldType>
              label="密码"
              name="password"
              rules={[{ pattern: /^(?=.*\d).{6,}$/, message: '密码格式错误' }]}
            >
              <Input.Password placeholder="请输入旧密码" />
            </Form.Item>
          )}
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
