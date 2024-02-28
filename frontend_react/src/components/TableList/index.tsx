import { FC, memo, useState } from 'react';
import './index.less';
import TableHeader from './TableHeader';
import List from './DataList';
import Content from './Setting';
import { ColumnsType } from 'antd/es/table';
import { SizeType } from 'antd/es/config-provider/SizeContext';
interface TableProps {
  tableHeader: TableAPI.TableHeader;
  tableList: TableAPI.TableList<ColumnsType<TableAPI.DataType>>;
  loadList: (value?: any) => void;
  changePage: (value?: any) => void;
  onAddHandle: (value?: any) => void;
  onDeleteHandle: (value?: any) => void;
}

const TableList: FC<TableProps> = ({ tableHeader, tableList, loadList, changePage, onAddHandle, onDeleteHandle }) => {
  const [size, setSize] = useState<SizeType>('middle');
  const changeSize = (value: SizeType) => {
    setSize(value);
  };

  return (
    <div className="table">
      <TableHeader
        searchName={tableHeader.title}
        element={<Content defaultData={tableHeader.defaultSettingData} />}
        loadList={loadList}
        onAddHandle={onAddHandle}
        changeSize={changeSize}
      />
      <List
        defaultColumns={tableList.defaultColumns}
        tableData={tableList.tableData}
        total={tableList.total}
        limit={tableList.limit}
        page={tableList.page}
        show={tableList.show}
        size={size}
        loadList={loadList}
        changePage={changePage}
        onDeleteHandle={onDeleteHandle}
      />
    </div>
  );
};
export default memo(TableList);
