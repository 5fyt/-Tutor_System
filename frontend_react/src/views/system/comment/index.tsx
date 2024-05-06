import { FC, memo, useCallback, useEffect, useState, useRef } from 'react';
import { defaultSettingData } from './constants/index';
import type { ColumnsType } from 'antd/es/table';
import { Button, Space, message } from 'antd';
import TableList from '@/components/TableList';
import { isArray } from '@/utils/is';
import { deleteReserve, getReserveListByStatus } from '@/api/system/reserve';
import AddComment from './AddComment';
// import AddReserve from './AddReserve';

interface ModalProps {
  showModal: (value?: any) => void;
}
const ReserveManage: FC = () => {
  const defaultColumns: ColumnsType<TableAPI.DataType> = [
    { title: '发布者', dataIndex: 'name', key: '0' },
    { title: '课程名称', dataIndex: 'course', key: '1' },
    { title: '课程年级', dataIndex: 'grade', key: '2' },
    {
      title: '评价',
      dataIndex: 'comment',
      key: '3'
    },
    {
      title: '评价分数',
      dataIndex: 'score',
      key: '4'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: '5',
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
      const { list, total } = await getReserveListByStatus({ page, limit, ...info });
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
    title: '评价记录',
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

      <TableList
        tableHeader={tableHeader}
        tableList={tableList}
        loadList={searchInfo}
        changePage={changePage}
        onAddHandle={updateHandle}
        onDeleteHandle={deleteHandle}
      />
      <AddComment innerRef={innerRef} onLoadList={loadList} />
    </>
  );
};
export default memo(ReserveManage);
