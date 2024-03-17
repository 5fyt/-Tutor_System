import { FC, memo, Ref, useImperativeHandle, useState, useRef } from 'react';
import { Form, Input, Modal, Button, message, SelectProps, Select } from 'antd';

import TextArea from 'antd/es/input/TextArea';
import { addScore, updateScore } from '@/api/system/score';

type FieldType = {
  usualGrades: string;
  allScore: string;
  classResult: string;
  comments: string;
};

interface ModalProps {
  innerRef: Ref<{ showModal: (value?: any) => void }>;
  onLoadList?: (value?: any) => void;

  options?: SelectProps['options'];
}

const AddScore: FC<ModalProps> = ({ innerRef, onLoadList, options }) => {
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
          console.log(submitInfo.userId);

          const { code } = await updateScore({ id, ...submitInfo });
          if (code === 200) {
            onLoadList?.();
            messageApi.success('更新成功');
            setTimeout(() => {
              setVisible(false);
              setId(0);
              formRef.current?.resetFields();
            }, 100);
          } else {
            messageApi.error('更新失败');
          }
        } else {
          const { code } = await addScore({ ...submitInfo });
          if (code === 200) {
            messageApi.success('添加成功');
            onLoadList?.();
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
      const { id } = value;
      setId(id);
      form.setFieldsValue({ ...value });
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
          <Form.Item
            label="用户名"
            name="userId"
            rules={[
              {
                required: true,
                message: '请选择用户'
              }
            ]}
          >
            <Select placeholder="请选择" options={options} />
          </Form.Item>
          <Form.Item<FieldType>
            label="平时分数"
            name="usualGrades"
            rules={[
              {
                required: true,
                message: '请输入分数名'
              },
              {
                pattern: /^[0-9]{1,3}$/,
                message: '分数格式错误'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="课堂分数"
            name="classResult"
            rules={[
              {
                required: true,
                message: '请输入分数名'
              },
              {
                pattern: /^[0-9]{1,3}$/,
                message: '分数格式错误'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="总分数"
            name="allScore"
            rules={[
              {
                required: true,
                message: '请输入分数名'
              },
              {
                pattern: /^[0-9]{1,3}$/,
                message: '分数格式错误'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="评价" name="comments">
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default memo(AddScore);
