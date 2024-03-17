import { FC, memo, useCallback, useEffect, useState, useRef } from 'react';
import { defaultSettingData } from './constants/index';
import type { ColumnsType } from 'antd/es/table';
import { Button, Space, Avatar } from 'antd';
import dayjs from 'dayjs';
import { getUserList } from '@/api/system/user';
import TableList from '@/components/TableList';

import { getPreScoringListByRole } from '@/api/system/reserve';
import AddScore from './AddScore';

interface ModalProps {
  showModal: (value?: any) => void;
}
const EnterScore: FC = () => {
  const defaultColumns: ColumnsType<TableAPI.DataType> = [
    {
      title: '头像',
      dataIndex: 'head_img',
      key: '1',
      render: text => {
        return text ? (
          <Avatar src={text} />
        ) : (
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        );
      }
    },
    { title: '姓名', dataIndex: 'name', key: '2' },
    { title: '课程名称', dataIndex: 'course', key: '3' },
    { title: '课程年级', dataIndex: 'grade', key: '4' },
    {
      title: '预约起始日期',
      dataIndex: 'startDate',
      key: '5',
      render: text => {
        return <span>{dayjs(text).format('YYYY-MM-DD')}</span>;
      }
    },
    {
      title: '预约结束日期',
      dataIndex: 'endDate',
      key: '6',
      render: text => {
        return <span>{dayjs(text).format('YYYY-MM-DD')}</span>;
      }
    },
    {
      title: '预约开始时间',
      dataIndex: 'startTime',
      key: '7'
    },
    {
      title: '预约结束时间',
      dataIndex: 'endTime',
      key: '8'
    },
    { title: '详细地址', dataIndex: 'detailAddress', key: '7' },

    {
      title: '操作',
      dataIndex: 'operation',
      key: '9',
      render: (_, record: any) => (
        <Space>
          <Button onClick={() => addHandle()} type="primary" ghost disabled={record.isShow}>
            录入分数
          </Button>
        </Space>
      )
    }
  ];
  const [tableData, setTableData] = useState<any[]>([]);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [userOption, setUserOption] = useState<any[]>([]);
  const innerRef = useRef<ModalProps>(null);
  const loadList = useCallback(
    async (info?: any) => {
      const { list, total } = await getPreScoringListByRole({ page, limit, ...info });
      const filter = list.map((item: any) => {
        return { ...item, key: item.id };
      });
      setTableData(filter);
      setTotal(total);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const getOptions = useCallback(async () => {
    const list = await getUserList();

    setUserOption(list);
  }, []);
  useEffect(() => {
    loadList();
    getOptions();
  }, [loadList, getOptions]);
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
    page
  };
  return (
    <>
      <TableList
        tableHeader={tableHeader}
        tableList={tableList}
        loadList={searchInfo}
        changePage={changePage}
        onAddHandle={addHandle}
      />
      <AddScore innerRef={innerRef} onLoadList={loadList} options={userOption} />
      {/* <AddReserve innerRef={innerRef} onLoadList={loadList} /> */}
    </>
  );
};
export default memo(EnterScore);
