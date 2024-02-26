// import { DataNode } from 'antd/es/tree';

declare namespace TableAPI {
  type SettingType = {
    key: string;
    title: string;
  };
  type TableHeader = {
    title: string;
    defaultSettingData: SettingType[];
  };
  type DataType = {
    name: string;
    username: string;
    phone: string;
    email: string;
    roleNames: string[];
    psalt: string;
    headImg: string;
  };
  type TableList<T> = {
    defaultColumns: T;
    total: number;
    page: number;
    limit: number;
  } & { tableData: API.PageItem[] };
}
