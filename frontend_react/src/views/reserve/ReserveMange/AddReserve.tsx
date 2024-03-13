import { FC, memo, Ref, useImperativeHandle, useState, useRef } from 'react';
import { Form, DatePicker, TimePicker, Modal, Button, message } from 'antd';
import { addReserve, updateReserve } from '@/api/system/reserve';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { RangePicker } = DatePicker;
const format = 'HH:mm';
type FieldType = {
  date: string;
  startTime: string;
  endTime: string;
  detailAddress: string;
};

interface ModalProps {
  innerRef: Ref<{ showModal: (value?: any) => void }>;
  onLoadList?: (value?: any) => void;
}

const AddReserve: FC<ModalProps> = ({ innerRef, onLoadList }) => {
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<number>(0);

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
        const data = {
          tutorId: id,
          startDate: dayjs(submitInfo.date[0], 'YYYY-MM-DD').format('YYYY-MM-DD'),
          endDate: dayjs(submitInfo.date[1], 'YYYY-MM-DD').format('YYYY-MM-DD'),
          startTime: dayjs(submitInfo.startTime, 'HH:mm').format('HH:mm'),
          endTime: dayjs(submitInfo.endTime, 'HH:mm').format('HH:mm'),
          detailAddress: submitInfo.detailAddress
        };
        if (id) {
          const { code } = await updateReserve({ id, ...data });
          if (code === 200) {
            messageApi.success('更新成功');
            onLoadList?.();
            setTimeout(() => {
              setVisible(false);
              setId(0);
              formRef.current?.resetFields();
            }, 100);
          } else {
            messageApi.error('更新失败');
          }
        } else {
          const { code } = await addReserve(data);
          if (code === 200) {
            messageApi.success('添加成功');
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
      setId(value.id);

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
          <Form.Item<FieldType>
            label="起始时间"
            name="startTime"
            rules={[
              {
                required: true,
                message: '请选择上课时间'
              }
            ]}
          >
            <TimePicker format={format} placeholder="请选择上课时间" />
          </Form.Item>
          <Form.Item<FieldType>
            label="结束时间"
            name="endTime"
            rules={[
              {
                required: true,
                message: '请选择下课时间'
              }
            ]}
          >
            <TimePicker format={format} placeholder="请选择下课时间" />
          </Form.Item>
          <Form.Item<FieldType>
            label="日期"
            name="date"
            rules={[
              {
                required: true,
                message: '请选择起始日期和结束日期'
              }
            ]}
          >
            <RangePicker locale={locale} />
          </Form.Item>
          <Form.Item<FieldType> label="详细地址" name="detailAddress">
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default memo(AddReserve);
