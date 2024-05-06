import { FC, memo, Ref, useImperativeHandle, useState, useRef } from 'react';
import { Form, Input, Modal, Button, message } from 'antd';

import TextArea from 'antd/es/input/TextArea';
import { addComment, updateComment } from '@/api/system/reserve';
type FieldType = {
  comment: string;
  score: number;
};

interface ModalProps {
  innerRef: Ref<{ showModal: (value?: any) => void }>;
  onLoadList: (value?: any) => void;
}

const AddRole: FC<ModalProps> = ({ innerRef, onLoadList }) => {
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<number>();
  const [score, setScore] = useState<number>();
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
        if (score) {
          console.log(submitInfo);
          const { code } = await updateComment({ id, ...submitInfo });
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
          const { code } = await addComment({ id, ...submitInfo });
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
  const showModal = async (value: any) => {
    if (value) {
      const { comment, score, reserve_id } = value;

      setId(reserve_id);
      setScore(score);
      form.setFieldsValue({ comment, score });
    }
    setVisible(true);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={score ? '修改' : '新增'}
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
            label="评价"
            name="comment"
            rules={[
              {
                required: true,
                message: '请输入分数'
              }
            ]}
          >
            <TextArea placeholder="请输入对本次预约的评价" />
          </Form.Item>

          <Form.Item<FieldType>
            label="评分"
            name="score"
            rules={[
              {
                required: true,
                message: '请输入分数'
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default memo(AddRole);
