import { memo, useState, FC, useEffect } from 'react';
import { Table, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import type { TableProps } from 'antd/es/table';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { useAppSelector } from '@/store';
// import Style from '../styles/list.module.scss';
// import { useAppDispatch, useAppSelector } from '@/stores';
// import { pageIndex, pageSize, updatePage } from '@/stores/module/goods';
// import { results, totalCount } from '@/stores/module/goods';
// import { SizeType } from 'antd/es/config-provider/SizeContext';
// import { changeStatus, deleteGoods } from '@/services/api/goods';
// import UploadExcel from '../../../UploadExcel';
// interface DataType {
//   key: React.Key;
//   name: string;
//   code: string;
//   currentPrice: string;
//   originalPrice: string;
//   discount: string;
//   salesVolume: number;
//   type: string;
//   status: number;
//   hasExcel: boolean;
// }
// type Iprop = {
//   checkKeys: any[];
//   show: boolean;
//   sz: SizeType;
//   addShow: (value?: any) => void;
//   loadList: (value?: any) => void;
// };
// interface ModalProps {
//   showModal: (value: any) => void;
// }
interface ListProps {
  loadList: (value?: any) => void;
  changePage: (value?: any) => void;
  onDeleteHandle: (value?: any) => void;
  defaultColumns: ColumnsType<TableAPI.DataType>;
  tableData: any[];
  total: number;
  page: number;
  limit: number;
  show: boolean;
  size: SizeType;
}
const List: FC<ListProps> = ({
  defaultColumns,
  tableData,
  total,
  page,
  limit,
  size,
  show,
  loadList,
  changePage,
  onDeleteHandle
}) => {
  const checkedKey = useAppSelector(state => state.user.checkedkeys);
  const isCheckAll = useAppSelector(state => state.user.isAllChecked);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [hasSelected, setHasSelected] = useState(false);
  //列选项数组
  const [columns, setColumns] = useState(defaultColumns);

  // //表格与设置按钮交互
  useEffect(() => {
    if (checkedKey.length > 0 && !isCheckAll) {
      const newColumns = defaultColumns.filter(item => checkedKey.includes(item?.key as string));
      setColumns(newColumns);
    } else if (checkedKey.length === 0 && !isCheckAll) {
      setColumns([]);
    } else {
      setColumns(defaultColumns);
    }
  }, [defaultColumns, checkedKey, isCheckAll]);
  useEffect(() => {
    const show = selectedRowKeys.length > 0;
    setHasSelected(show);
  }, [selectedRowKeys.length]);
  // //操作表格数据

  // const updateData = (record: any) => {
  //   const { id } = record;
  //   addShow(id);
  // };

  // const deleteList = async (ids: string[]) => {
  //   try {
  //     const res = await deleteGoods({ ids });
  //     if (res.code === 200) {
  //       message.success('删除成功');
  //       loadList();
  //     } else {
  //       message.error(res.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //监听表格选中项
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    console.log(selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  //表格选中配置项
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  //表格监听变化
  const onChange: TableProps<TableAPI.DataType>['onChange'] = pagination => {
    const { current, pageSize } = pagination;
    console.log(current, pageSize);
    changePage({ current, pageSize });
    loadList({ page: current, limit: pageSize });
  };
  //取消选中
  const cancelHandle = () => {
    setSelectedRowKeys([]);
  };
  //批量删除
  const deleteAllUser = () => {
    onDeleteHandle(selectedRowKeys);
  };
  return (
    <div className="content">
      {hasSelected && !show && (
        <div className="tips">
          <div className="title">
            <span>{hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ''}</span>
          </div>
          <div className="cancel">
            <span onClick={cancelHandle}>取消选择</span>
          </div>
        </div>
      )}

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tableData}
        onChange={onChange}
        size={size}
        pagination={{
          pageSize: limit,
          total: total,
          current: page,
          pageSizeOptions: [10, 20, 30],
          showSizeChanger: true
        }}
      />
      {hasSelected && !show && (
        <div className="footer_bar">
          <div className="left">
            {hasSelected ? (
              <>
                <div>
                  已选择
                  <span style={{ color: '#1e93ff' }}>&nbsp;{selectedRowKeys.length} &nbsp;</span>项
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="right">
            <Button type="primary" ghost onClick={deleteAllUser}>
              批量删除
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(List);
