import './index.less';
import { FC, memo } from 'react';
import { options, defaultSettingData } from './constants/index';
import type { ColumnsType } from 'antd/es/table';
// import { Avatar, List, Button, Input, message } from 'antd';
// import { useAppDispatch, useAppSelector } from '@/stores';
// import { results, searchUserAsync, totalCount } from '@/stores/module/admin';
// import AddUser from './UserDialog/index';
import SearchForm from '@/components/SearchForm';
import TableList from '@/components/TableList';

// import { deleteUser } from '@/services/api/admin';
// const { Search } = Input;

// interface ModalProps {
//   showModal: () => void;
// }
const User: FC = () => {
  const defaultColumns: ColumnsType<TableAPI.DataType> = [{ title: '用户名', dataIndex: 'username', key: '1' }];
  const searchInfo = () => {};
  const tableHeader = {
    title: '用户名',
    defaultSettingData
  };
  const tableList = {
    defaultColumns
  };
  return (
    <div className="user">
      <SearchForm setSearchInfo={searchInfo} options={options} />
      <TableList tableHeader={tableHeader} tableList={tableList} />
    </div>
  );
};
export default memo(User);
