import { FC, memo, Ref, useImperativeHandle, useState, useRef, useCallback, useEffect } from 'react';
import { Form, Input, Modal, Button, message, Select } from 'antd';
import { getCourseList } from '@/api/system/course';
import { getUserList } from '@/api/system/user';
import { addTutor, updateTutor } from '@/api/system/tutor';
import { useAppSelector } from '@/store';
import { user_name } from '@/store/module/login';
type FieldType = {
  userId: number;
  address: string;
  grade: string;
  course: string;
  description: string;
  money: string;
};
interface Option {
  value: number;
  label: string;
}
interface ModalProps {
  innerRef: Ref<{ showModal: (value?: any) => void }>;
  onLoadList: (value?: any) => void;
}
const { TextArea } = Input;
const PublishInfo: FC<ModalProps> = ({ innerRef, onLoadList }) => {
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState<number>();
  const username = useAppSelector(user_name);
  const [userOption, setUserOption] = useState<Option[]>([]);
  const [courseOption, setCouserOption] = useState<Option[]>([]);
  const [gradeOption, setGradeOption] = useState<Option[]>([]);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const formRef = useRef<any>();
  //将子组件上的方法暴露给父组件，类型于Vue中defineExpose({})
  useImperativeHandle(innerRef, () => ({
    showModal
  }));
  const getOptions = useCallback(async () => {
    const list = await getUserList();
    const filterList = list.filter((item: any) => item.label === username);
    const { courseList, gradeList } = await getCourseList();
    setCouserOption(courseList);
    setGradeOption(gradeList);
    setUserOption(filterList);
  }, [username]);
  useEffect(() => {
    getOptions();
  }, [getOptions]);
  const handleOk = () => {
    try {
      formRef.current?.validateFields().then(async (submitInfo: any) => {
        if (id) {
          console.log(parseFloat(submitInfo.money));
          const { code } = await updateTutor({ id, ...submitInfo, money: parseFloat(submitInfo.money) });
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
          const { grade, course, money, ...data } = submitInfo;
          const filterGrade = gradeOption.filter(item => item.value === grade)[0]?.label;
          const filterCourse = courseOption.filter(item => item.value === course)[0]?.label;
          const { code } = await addTutor({
            ...data,
            grade: filterGrade,
            course: filterCourse,
            money: parseFloat(money)
          });
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
      const userId = userOption.filter(item => item.label === value.name)[0]?.value;
      // const { title, description, remark, id } = value;
      setId(value.id);
      form.setFieldsValue({ ...value, userId });
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
            label="地址"
            name="address"
            rules={[
              {
                required: true,
                message: '请输入地址'
              }
            ]}
          >
            <Input placeholder="请输入地址" />
          </Form.Item>

          <Form.Item<FieldType> label="家教信息" name="description">
            <TextArea />
          </Form.Item>
          <Form.Item<FieldType>
            label="用户"
            name="userId"
            rules={[
              {
                required: true,
                message: '请选择自己姓名'
              }
            ]}
          >
            <Select options={userOption} />
          </Form.Item>
          <Form.Item<FieldType>
            label="年级"
            name="course"
            rules={[
              {
                required: true,
                message: '请选择年级'
              }
            ]}
          >
            <Select options={gradeOption} />
          </Form.Item>
          <Form.Item<FieldType>
            label="课程"
            name="grade"
            rules={[
              {
                required: true,
                message: '请选择课程'
              }
            ]}
          >
            <Select options={courseOption} />
          </Form.Item>
          <Form.Item<FieldType>
            label="地址"
            name="money"
            rules={[
              {
                required: true,
                message: '请输入金额'
              },
              {
                pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
                message: '金额格式错误'
              }
            ]}
          >
            <Input prefix="￥" suffix="RMB" placeholder="最小精确到小数点后两位" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default memo(PublishInfo);
