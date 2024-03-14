import './index.less';
import { FC, memo, useCallback, useEffect, useState, useRef } from 'react';
import { options, defaultSettingData } from './constants/index';
import type { ColumnsType } from 'antd/es/table';
import { Avatar, Button, Space, Tag, message } from 'antd';
import AddUser from './UserDialog/index';
import SearchForm from '@/components/SearchForm';
import TableList from '@/components/TableList';
import { deleteUser, getRoleList, searchUser } from '@/api/system/user';
import { isArray } from '@/utils/is';

interface ModalProps {
  showModal: (value?: any) => void;
}
const User: FC = () => {
  const defaultColumns: ColumnsType<TableAPI.DataType> = [
    {
      title: '头像',
      dataIndex: 'headImg',
      key: '1',
      render: text => {
        return text ? (
          <Avatar src={text} />
        ) : (
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        );
      }
    },
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
            <Space>
              <Tag color="green">{text.slice(0, 1)}</Tag>
              {text.length > 1 && <Tag color="green">{text.slice(1)}</Tag>}
            </Space>
          </div>
        );
      }
    },
    {
      title: '标识',
      dataIndex: 'psalt',
      key: '7',
      responsive: ['md'],
      render: text => {
        return <div style={{ width: '120px' }}>{text}</div>;
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
  const [roleOptions, setRoleOptions] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
  const updateHandle = (record: any) => {
    innerRef.current?.showModal(record);
  };
  const deleteHandle = async (value: any) => {
    let userIds = [];
    isArray(value) ? (userIds = value) : userIds.push(value.id);
    const { code } = await deleteUser({ userIds });
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
    title: '用户名',
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
      <AddUser innerRef={innerRef} roleOptions={roleOptions} onLoadList={loadList} />
    </>
  );
};
export default memo(User);
