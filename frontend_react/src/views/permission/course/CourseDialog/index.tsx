import { FC, memo, Ref, useImperativeHandle, useState, useRef } from 'react';
import { Form, Input, Modal, Button, message } from 'antd';
import { addCourse, updateCourse } from '@/api/system/course';

type FieldType = {
  name: string;
  grade: string;
  description: string;
};

interface ModalProps {
  innerRef: Ref<{ showModal: (value?: any) => void }>;
  onLoadList: (value?: any) => void;
}

const AddCourse: FC<ModalProps> = ({ innerRef, onLoadList }) => {
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<number>();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const formRef = useRef<any>();
  //将子组件上的方法暴露给父组件，类型于Vue中defineExpose({})
  useImperativeHandle(innerRef, () => ({
    showModal
  }));

  const handleOk = () => {
    try {
      formRef.current?.validateFields().then(async (submitInfo: any) => {
        if (id) {
          console.log(submitInfo);
          const { code, message } = await updateCourse({ id, ...submitInfo });
          if (code === 200) {
            messageApi.success('更新成功');
            onLoadList();
            setTimeout(() => {
              setVisible(false);
              setId(0);
              formRef.current?.resetFields();
            }, 100);
          } else {
            code === 10004 ? messageApi.error(message) : messageApi.error('更新失败');
          }
        } else {
          console.log(submitInfo);
          const { code, message } = await addCourse(submitInfo);
          if (code === 200) {
            messageApi.success('添加成功');
            onLoadList();
            setTimeout(() => {
              setVisible(false);
              formRef.current?.resetFields();
            }, 100);
          } else {
            code === 10004 ? messageApi.error(message) : messageApi.error('添加失败');
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
  const showModal = async (value: any) => {
    if (value) {
      const { title, description, remark, id } = value;
      // console.log(grade);
      setId(id);
      form.setFieldsValue({ name: title, grade: description, description: remark });
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
            label="课程名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入课程名'
              }
            ]}
          >
            <Input placeholder="请输入课程名" />
          </Form.Item>

          <Form.Item<FieldType>
            label="年级"
            name="grade"
            rules={[
              {
                required: true,
                message: '请输入年级'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="课程描述" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default memo(AddCourse);
