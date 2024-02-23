// import { FC, memo, useState, useRef, useEffect } from 'react';

import './index.less';
import { FC, memo } from 'react';
// import { Avatar, List, Button, Input, message } from 'antd';
// import { useAppDispatch, useAppSelector } from '@/stores';
// import { results, searchUserAsync, totalCount } from '@/stores/module/admin';
// import AddUser from './UserDialog/index';
import SearchForm from '@/components/SearchForm';

// import { deleteUser } from '@/services/api/admin';
// const { Search } = Input;

// interface ModalProps {
//   showModal: () => void;
// }
const User: FC = () => {
  const searchInfo = () => {};
  const options = [
    { id: 1, name: 'username', label: '用户名' },
    { id: 2, name: 'name', label: '姓名' },
    { id: 3, name: 'phone', label: '手机号' },
    { id: 4, name: 'email', label: '邮箱' }
  ];
  return <SearchForm setSearchInfo={searchInfo} options={options} />;
};
export default memo(User);
