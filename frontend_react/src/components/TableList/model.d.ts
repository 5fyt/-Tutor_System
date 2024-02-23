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
    roleName: number[];
    psalt: string;
    headImg: string;
  };
  type TableList<T> = {
    defaultColums: T;
  };
}
