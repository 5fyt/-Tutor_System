import { FC, memo } from 'react';
import './index.less';
import TableHeader from './TableHeader';
import List from './DataList';
import Content from './Setting';
import { ColumnsType } from 'antd/es/table';
// import Style from './index.module.scss';
// import { Button, Dropdown, Space, Popover, Radio } from 'antd';
// import type { RadioChangeEvent } from 'antd';
// import { PlusOutlined, ReloadOutlined, ColumnHeightOutlined, SettingOutlined } from '@ant-design/icons';
// import type { MenuProps } from 'antd';

// import { useAppDispatch } from '@/store';
// import { pageIndex, pageSize, searchGoodsAsync } from '@/stores/module/goods';
// import { SizeType } from 'antd/es/config-provider/SizeContext';
// import AddGoods from '../DialogForm/index';
// import { useLocation } from 'react-router-dom';
//点击复选框触发
/**
 * 设置表格，当默认状态显示的是表格对应的父树节点，且独占一行，父节点前面icon自定义，父节点后面有固定在列首和列尾两个icon图标
 * 当点击固定列首icon图标，将点击这项添加到固定左侧父节点中的子节点，该子节点和父节点失去前面的icon图标，该子节点后面的固定列首图标变成不固定图标和固定在列尾，剩余的父节点被添加进不固定的父节点中的子节点，子节点保留前面的icon图标
 * 当点击固定列尾icon图标，将点击这项添加到固定右侧父节点中的子节点，该子节点和父节点失去前面的icon图标，该子节点后面的固定列尾图标变成固定在列首和不固定图标，剩余的父节点被添加进不固定的父节点中的子节点，子节点保留前面的icon图标
 * 当固定列首或列为出现两个子节点，又将直接的子节点前面icon显示出来(未实现)
 *
 */

// type Iprop = {
//   searchInfo: {
//     name?: string;
//     code?: string;
//     type?: number;
//   };
// };
// interface ModalProps {
//   showModal: (value?: any) => void;
// }
interface TableProps {
  tableHeader: TableAPI.TableHeader;
  tableList: TableAPI.TableList<ColumnsType<TableAPI.DataType>>;
  loadList: (value?: any) => void;
  changePage: (value?: any) => void;
}

const TableList: FC<TableProps> = ({ tableHeader, tableList, loadList, changePage }) => {
  // const size = useAppSelector(pageSize);
  // const page = useAppSelector(pageIndex);
  // const dispatch = useAppDispatch();
  // const { pathname } = useLocation();
  // const showRef = useRef<ModalProps>(null);
  // // const [radioValue, setRadioValue] = useState(0);
  // const [sz, setSz] = useState<SizeType>('middle');
  // //list 传过来的值
  // const [checkKeys, setCheckKeys] = useState<string[]>([]);
  // const [show, setShow] = useState(true);
  // const getKeys = (value: string[]) => {
  //   setCheckKeys(value);
  // };
  // const showChecked = (value: boolean) => {
  //   setShow(value);
  // };
  //获取表格数据
  // const loadList = async () => {
  // const data = {
  //   page,
  //   size
  // };
  // await dispatch(searchGoodsAsync({ ...data, ...info }));
  // };
  // useEffect(() => {
  //   loadList(searchInfo);
  // }, [searchInfo, pathname]);
  // const emitLoadList = (value: any) => {
  //   console.log(value);
  //   loadList(value);
  // };
  //切换radio查询数据
  // const onChangeHandle = ({ target: { value } }: RadioChangeEvent) => {
  //   setRadioValue(value);
  //   localStorage.setItem('status', value);
  //   // if (value !== 0) {
  //   //   const data = {
  //   //     status: value
  //   //   };
  //     // loadList({ ...data, ...searchInfo });
  //   } else {
  //     loadList(searchInfo);
  //   }
  // };
  //刷新表格
  // const refreshHandle = () => {
  //   if (radioValue !== 0) {
  //     const data = {
  //       status: radioValue
  //     };
  //     loadList({ ...data, ...searchInfo });
  //   } else {
  //     loadList(searchInfo);
  //   }
  // };
  // const addShow = (value: any) => {
  //   showRef.current?.showModal(value);
  // };
  // return (
  //   // <div className=''
  //   // <div className={Style.table}>
  //   //   <div className="list">
  //   //     <List
  //   //       checkKeys={checkKeys}
  //   //       show={show}
  //   //       addShow={value => addShow(value)}
  //   //       loadList={value => emitLoadList(value)}
  //   //       sz={sz}
  //   //     ></List>
  //   //   </div>
  //   //   {/* <AddGoods innerRef={showRef} loadList={() => loadList()}></AddGoods> */}
  //   // </div>
  // );
  return (
    <div className="table">
      <TableHeader searchName={tableHeader.title} element={<Content defaultData={tableHeader.defaultSettingData} />} />
      <List
        defaultColumns={tableList.defaultColumns}
        loadList={loadList}
        changePage={changePage}
        tableData={tableList.tableData}
        total={tableList.total}
        limit={tableList.limit}
        page={tableList.page}
      />
    </div>
  );
};
export default memo(TableList);
