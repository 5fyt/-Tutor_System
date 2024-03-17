import { FC, memo, useCallback, useEffect, useState, useRef } from 'react';
import { options, defaultSettingData } from './constants/index';
import type { ColumnsType } from 'antd/es/table';
import TableList from '@/components/TableList';
import AddScore from '../../teacher/EnterScore/AddScore';
import { searchScoreStudentList } from '@/api/system/score';
import SearchForm from '@/components/SearchForm';

import { getUserList } from '@/api/system/user';
interface ModalProps {
  showModal: (value?: any) => void;
}
const PerOrder: FC = () => {
  const defaultColumns: ColumnsType<TableAPI.DataType> = [
    { title: '姓名', dataIndex: 'user_name', key: '1' },
    { title: '课程名称', dataIndex: 'course', key: '2' },
    { title: '课程年级', dataIndex: 'grade', key: '3' },
    { title: '平时成绩', dataIndex: 'usualGrades', key: '4' },
    { title: '课堂成绩', dataIndex: 'classResult', key: '5' },
    { title: '总成绩', dataIndex: 'allScore', key: '6' },

    { title: '个人评语', dataIndex: 'comments', key: '7' }
  ];
  const [tableData, setTableData] = useState<any[]>([]);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [userOption, setUserOption] = useState<any[]>([]);
  const innerRef = useRef<ModalProps>(null);
  const loadList = useCallback(
    async (info?: any) => {
      const { list, total } = await searchScoreStudentList({ page, limit, ...info });
      const filter = list?.map((item: any) => {
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

  const tableHeader = {
    title: '成绩',
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
      <SearchForm setSearchInfo={searchInfo} options={options} />
      <TableList tableHeader={tableHeader} tableList={tableList} loadList={searchInfo} changePage={changePage} />
      <AddScore innerRef={innerRef} onLoadList={loadList} options={userOption} />
      {/* <AddReserve innerRef={innerRef} onLoadList={loadList} /> */}
    </>
  );
};
export default memo(PerOrder);
