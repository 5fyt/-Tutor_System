// import './index.less';
import { FC, memo, useCallback, useEffect, useState, useRef } from 'react';
import { defaultSettingData, options } from './constants/index';
import type { ColumnsType } from 'antd/es/table';
import { Button, Space, message, Switch } from 'antd';
import moment from 'moment';
import SearchForm from '@/components/SearchForm';
import TableList from '@/components/TableList';
import { isArray } from '@/utils/is';
import { getTutorList, deleteTutor, updateTutorStatus } from '@/api/system/tutor';
import PublishInfo from './PublishInfo';

interface ModalProps {
  showModal: (value?: any) => void;
}
const TutorInfo: FC = () => {
  const defaultColumns: ColumnsType<TableAPI.DataType> = [
    { title: '姓名', dataIndex: 'name', key: '0' },
    {
      title: '地址',
      dataIndex: 'address',
      key: '1'
    },
    { title: '课程', dataIndex: 'course', key: '2' },
    { title: '年级', dataIndex: 'grade', key: '3' },
    { title: '信息描述', dataIndex: 'description', key: '4' },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: '5',
      render: text => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
    },
    { title: '家教费用', dataIndex: 'money', key: '6', render: text => <span>{text}元</span> },
    {
      title: '状态',
      dataIndex: 'status',
      key: '7',
      render: (_, record) => {
        return (
          <Switch
            onClick={value => switchHandle(value, record)}
            checkedChildren="下架"
            checked={record.status === 1 ? true : false}
            unCheckedChildren="上架"
            defaultChecked
          />
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: '8',
      render: (_, record) => (
        <Space>
          <Button onClick={() => updateHandle(record)} type="primary" ghost>
            修改
          </Button>
          <Button onClick={() => deleteHandle(record)} type="primary" ghost danger>
            删除
          </Button>
        </Space>
      )
    }
  ];
  const [tableData, setTableData] = useState<any[]>([]);
  // const [roleOptions, setRoleOptions] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const innerRef = useRef<ModalProps>(null);
  const loadList = useCallback(
    async (info?: any) => {
      const { list, total } = await getTutorList({ page, limit, ...info });
      const filter = list.map((item: any) => {
        return { ...item, key: item.id };
      });
      setTableData(filter);
      setTotal(total);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => {
    loadList();
    // getOptions();
  }, [loadList]);
  const searchInfo = (info?: any) => {
    loadList(info);
  };
  //页码改变
  const changePage = ({ page, limit }: { page: number; limit: number }) => {
    setPage(page);
    setLimit(limit);
  };
  const addHandle = () => {
    innerRef.current?.showModal();
  };
  const updateHandle = (record: any) => {
    innerRef.current?.showModal(record);
  };
  const deleteHandle = async (value: any) => {
    let tutorIds = [];
    isArray(value) ? (tutorIds = value) : tutorIds.push(value.id);
    const { code } = await deleteTutor({ tutorIds });
    if (code === 200) {
      setShow(true);
      messageApi.success('删除成功');
      loadList();
    } else {
      setShow(true);
      messageApi.error('删除失败');
    }
  };
  const switchHandle = async (value: boolean, record: any) => {
    console.log(value, record);
    await updateTutorStatus({ id: record.id, status: value ? 1 : 2 });
    loadList();
  };
  const tableHeader = {
    title: '家教信息',
    defaultSettingData,
    isShow: true
  };
  const tableList = {
    defaultColumns,
    tableData,
    limit,
    total,
    page,
    show
  };
  return (
    <>
      {contextHolder}
      <SearchForm setSearchInfo={searchInfo} options={options} />
      <TableList
        tableHeader={tableHeader}
        tableList={tableList}
        loadList={searchInfo}
        changePage={changePage}
        onAddHandle={addHandle}
        onDeleteHandle={deleteHandle}
      />
      <PublishInfo innerRef={innerRef} onLoadList={loadList} />
      {/* <AddUser innerRef={innerRef} roleOptions={roleOptions} onLoadList={loadList} /> */}
    </>
  );
};
export default memo(TutorInfo);
