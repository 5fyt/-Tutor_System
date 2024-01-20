import { ReactNode } from 'react';

export type MenuList = MenuItem[];

//菜单配置项
export type MenuItem = {
  path: string;
  element: ReactNode;
  name?: string;
  auth?: boolean;
  children?: MenuItem[];
  redirect?: string;
  key: string;
  keyPath?: string;
  meta?: {
    icon?: string;
    noCache?: boolean;
  };
};
