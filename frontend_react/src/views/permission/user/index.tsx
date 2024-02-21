import { FC, memo, useState, useRef, useEffect } from 'react';
import './index.less';
import { Avatar, List, Button, Input, message } from 'antd';
// import { useAppDispatch, useAppSelector } from '@/stores';
// import { results, searchUserAsync, totalCount } from '@/stores/module/admin';
import AddUser from './UserDialog/index';

// import { deleteUser } from '@/services/api/admin';
const { Search } = Input;

interface ModalProps {
  showModal: () => void;
}
const User: FC = () => {
  // const total = useAppSelector(totalCount);
  // const dataList = useAppSelector(results);
  const listRef = useRef<any>([]);
  const dataList = [] as any[];
  const getList = (newArr: any[] = []) => {
    dataList.forEach(item => {
      const obj = {
        id: item.id,
        title: item.name,
        avatar: item.photo,
        description: item.username,
        content: {
          label: '入职时间',
          value: item.createTime
        }
      };
      newArr.push(obj);
    });
    return newArr;
  };
  listRef.current = getList();

  const addRef = useRef<ModalProps>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(3);
  // const dispatch = useAppDispatch();
  const loadList = async (info?: any) => {
    // const data = {
    //   page,
    //   size
    // };
    console.log(info);
    // await dispatch(searchUserAsync({ ...data, ...info }));
  };
  useEffect(() => {
    loadList();
  }, []);
  //搜索列表
  const onSearch = (value: any) => {
    const data = { name: value };
    if (value) {
      loadList(data);
    } else {
      loadList();
    }
  };
  //删除列表
  const deleteUsers = async (item: any) => {
    try {
      // const data = {
      //   ids: [item.id]
      // };
      // deleteUser(data, type);
      console.log(item);
      messageApi.success('删除成功');
      loadList();
    } catch (err) {
      console.log(err);
    }
  };
  const changeHandle = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
    loadList({ page, size: pageSize });
  };
  return (
    <>
      {contextHolder}
      <div className="container">
        <div className="list_title">
          <div className="title">
            <h3>用户列表</h3>
          </div>
          <div className="searchInput">
            <Button type="primary" className="btn" onClick={() => addRef.current?.showModal()}>
              新增用户
            </Button>
            <Search placeholder="请输入姓名" onSearch={onSearch} enterButton />
          </div>
        </div>
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          pagination={{
            onChange: changeHandle,
            pageSize: size,
            // total: total,
            current: page,
            pageSizeOptions: [3, 6, 12],
            showSizeChanger: true
          }}
          dataSource={listRef.current}
          renderItem={(item: any) => (
            <List.Item
              actions={[
                <a key="list-loadmore-edit" onClick={() => deleteUsers(item)}>
                  删除
                </a>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<div>{item.title}</div>}
                description={item.description}
              />
              <div className="content">
                <span>{item.content.label}</span>
                <p>{item.content.value}</p>
              </div>
            </List.Item>
          )}
        />
        <AddUser innerRef={addRef} searchInfo={loadList}></AddUser>
      </div>
    </>
  );
};
export default memo(User);
