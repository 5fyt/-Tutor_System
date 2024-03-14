// import { DataNode } from 'antd/es/tree';

declare namespace TableAPI {
  type SettingType = {
    key: string;
    title: string;
  };
  type TableHeader = {
    title: string;
    isShow: boolean;
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
    status: number;
    address: string;
    grade: string;
    course: string;
    publish: Date;
    description: string;
  };
  type TableList<T> = {
    defaultColumns: T;
    total: number;
    page: number;
    limit: number;
    show: boolean;
  } & { tableData: API.PageItem[] };
}
