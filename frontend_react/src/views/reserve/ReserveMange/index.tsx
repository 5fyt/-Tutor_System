import { FC, memo, useCallback, useEffect, useState, useRef } from 'react';
import { options, defaultSettingData } from './constants/index';
import type { ColumnsType } from 'antd/es/table';
import { Button, Space, message } from 'antd';
import dayjs from 'dayjs';
import SearchForm from '@/components/SearchForm';
import TableList from '@/components/TableList';
import { isArray } from '@/utils/is';
import { deleteReserve, getReserveList } from '@/api/system/reserve';
import AddReserve from './AddReserve';

interface ModalProps {
  showModal: (value?: any) => void;
}
const ReserveManage: FC = () => {
  const defaultColumns: ColumnsType<TableAPI.DataType> = [
    { title: '课程名称', dataIndex: 'tutor_course', key: '1' },
    { title: '课程年级', dataIndex: 'tutor_grade', key: '2' },
    {
      title: '预约起始日期',
      dataIndex: 'startDate',
      key: '3',
      render: text => {
        return <span>{dayjs(text).format('YYYY-MM-DD')}</span>;
      }
    },
    {
      title: '预约结束日期',
      dataIndex: 'endDate',
      key: '4',
      render: text => {
        return <span>{dayjs(text).format('YYYY-MM-DD')}</span>;
      }
    },
    {
      title: '预约开始时间',
      dataIndex: 'startTime',
      key: '5'
    },
    {
      title: '预约结束时间',
      dataIndex: 'endTime',
      key: '6'
    },
    { title: '详细地址', dataIndex: 'detailAddress', key: '7' },

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
  const [messageApi, contextHolder] = message.useMessage();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const innerRef = useRef<ModalProps>(null);
  const loadList = useCallback(
    async (info?: any) => {
      const { list, total } = await getReserveList({ page, limit, ...info });
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
    let reserveIds = [];
    isArray(value) ? (reserveIds = value) : reserveIds.push(value.id);
    const { code } = await deleteReserve({ reserveIds });
    if (code === 200) {
      setShow(true);
      messageApi.success('删除成功');
      loadList();
    } else {
      setShow(true);
      messageApi.error('删除失败');
    }
  };
  const tableHeader = {
    title: '预约',
    defaultSettingData,
    isShow: false
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
      <AddReserve innerRef={innerRef} onLoadList={loadList} />
    </>
  );
};
export default memo(ReserveManage);
