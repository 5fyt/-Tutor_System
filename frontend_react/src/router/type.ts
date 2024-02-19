import { ReactNode } from 'react';

export type MenuList = MenuItem[];
export type MenuChild = Omit<MenuItem, 'children'>;
//菜单配置项
export type MenuItem = {
  path: string;
  element?: ReactNode;
  name?: string;
  auth?: boolean;
  children?: MenuItem[];
  redirect?: string;
  key: string;
  keyPath?: string;
  meta: {
    icon: string;
    role?: string[];
    noCache?: boolean;
  };
};
