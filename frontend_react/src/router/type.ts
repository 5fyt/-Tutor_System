import { ReactNode } from 'react';

export type MenuList = MenuItem[];
export type MenuChild = Omit<MenuItem, 'children'>;
export const ROLE_ADMIN = 'admin';
export const ROLE_STUDENT = 'student';
export const ROLE_TEACHER = 'teacher';
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
