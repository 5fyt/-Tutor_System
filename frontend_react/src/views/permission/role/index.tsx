import './index.less';
import { List, Avatar, Button, message } from 'antd';
import { deleteRole, getRoleList } from '@/api/system/role';
import SearchForm from '@/components/SearchForm';
import { FC, memo, useCallback, useEffect, useState, useRef } from 'react';
import AddRole from './RoleDialog';
interface ModalProps {
  showModal: (value?: any) => void;
}
const options = [
  { id: 1, name: 'name', label: '角色名' },
  { id: 2, name: 'remark', label: '备注' }
];
const Role: FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [total, setTotal] = useState(0);
  const innerRef = useRef<ModalProps>(null);
  const [roleList, setRoleList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  //搜索列表
  const loadList = useCallback(
    async (info?: any) => {
      const { total, list } = await getRoleList({ limit, page, ...info });
      console.log(list);

      const filterList = list.map((item: any) => {
        return { id: item.id, title: item.name, description: item.remark, time: item.createdAt };
      });
      setTotal(total);
      setRoleList(filterList);
    },
    [limit, page]
  );
  useEffect(() => {
    loadList();
  }, [loadList]);

  //删除列表
  const deleteRoles = async (item: any) => {
    const roleIds = [item.id];
    const { code } = await deleteRole({ roleIds });
    code === 200 ? messageApi.success('删除成功') : messageApi.error('删除失败');
    loadList({ page: 0, limit: 3 });
  };

  const changeHandle = (page: number, pageSize: number) => {
    setPage(page);
    setLimit(pageSize);
    loadList({ page, limit: pageSize });
  };
  const setSearchInfo = (info?: any) => {
    console.log(info);
    loadList(info);
  };
  const updateRoles = (item: any) => {
    innerRef.current?.showModal(item);
  };
  const addHandle = () => {
    innerRef.current?.showModal();
  };
  return (
    <>
      {contextHolder}
      <div className="role_container">
        <SearchForm setSearchInfo={setSearchInfo} options={options} />
        <div className="searchInput">
          <Button type="primary" className="btn" onClick={addHandle}>
            新增角色
          </Button>
        </div>
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          pagination={{
            onChange: changeHandle,
            pageSize: limit,
            total: total,
            current: page,
            pageSizeOptions: [3, 6, 12],
            showSizeChanger: true
          }}
          dataSource={roleList}
          renderItem={(item: any) => (
            <List.Item
              actions={[
                <a key="list-loadmore-edit" className="del" onClick={() => deleteRoles(item)}>
                  删除
                </a>,
                <a key="list-loadmore-edit" className="del" onClick={() => updateRoles(item)}>
                  编辑
                </a>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.id}`} />}
                title={<div>{item.title}</div>}
                description={item.description}
              />
              <div className="content">
                <span>{item.time}</span>
              </div>
            </List.Item>
          )}
        />
        <AddRole innerRef={innerRef} onLoadList={loadList}></AddRole>
      </div>
    </>
  );
};
export default memo(Role);
