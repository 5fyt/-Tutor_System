import './index.less';
import { FC, memo, useCallback, useEffect, useState, useRef } from 'react';
import { options, defaultSettingData } from './constants/index';
import type { ColumnsType } from 'antd/es/table';
import { Avatar, Button, Space, Tag } from 'antd';
// import { useAppDispatch, useAppSelector } from '@/stores';
// import { results, searchUserAsync, totalCount } from '@/stores/module/admin';
import AddUser from './UserDialog/index';
import SearchForm from '@/components/SearchForm';
import TableList from '@/components/TableList';
import { getRoleList, searchUser } from '@/api/system/user';
// import { deleteUser, updateUser } from '@/api/system/user';

// import { deleteUser } from '@/services/api/admin';
// const { Search } = Input;

interface ModalProps {
  showModal: () => void;
}
const User: FC = () => {
  const defaultColumns: ColumnsType<TableAPI.DataType> = [
    { title: '头像', dataIndex: 'headImg', key: '1', render: text => <Avatar src={text} /> },
    { title: '用户名', dataIndex: 'username', key: '2' },
    { title: '姓名', dataIndex: 'name', key: '3' },
    { title: '电话号码', dataIndex: 'phone', key: '4' },
    { title: '邮箱', dataIndex: 'email', key: '5' },
    {
      title: '角色',
      dataIndex: 'roleNames',
      key: '6',
      render: text => {
        return (
          <div>
            <Tag color="green">{text.slice(0, 1)}</Tag>
            {text.length > 1 && <Tag color="green">{text.slice(1)}</Tag>}
          </div>
        );
      }
    },
    { title: '标识', dataIndex: 'psalt', key: '7' },
    {
      title: '操作',
      dataIndex: 'operation',
      key: '8',
      render: () => (
        <Space>
          <Button onClick={() => updateHandle()} type="link">
            修改
          </Button>
          <Button onClick={() => deleteHandle()} type="link" danger>
            删除
          </Button>
        </Space>
      )
    }
  ];
  const [tableData, setTableData] = useState<any[]>([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const innerRef = useRef<ModalProps>(null);
  const loadList = useCallback(
    async (info?: any) => {
      const { list, total } = await searchUser({ page, limit, ...info });
      const filter = list.map(item => {
        return { ...item, key: item.id };
      });
      setTableData(filter);
      setTotal(total);
    },
    [limit, page]
  );
  const getOptions = useCallback(async () => {
    const list = await getRoleList();
    const filterList = list.map((item: any) => {
      return { value: item.id.toString(), label: item.name };
    });
    setRoleOptions(filterList);
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
  const updateHandle = () => {};
  const deleteHandle = () => {};
  const tableHeader = {
    title: '用户名',
    defaultSettingData
  };
  const tableList = {
    defaultColumns,
    tableData,
    limit,
    total,
    page
  };
  return (
    <div className="user">
      <SearchForm setSearchInfo={searchInfo} options={options} />
      <TableList
        tableHeader={tableHeader}
        tableList={tableList}
        loadList={searchInfo}
        changePage={changePage}
        onAddHandle={addHandle}
      />
      <AddUser innerRef={innerRef} roleOptions={roleOptions} onLoadList={loadList} />
    </div>
  );
};
export default memo(User);
