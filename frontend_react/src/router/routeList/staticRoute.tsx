import { lazy } from 'react';
import type { MenuList } from '../type';
import { type RouteObject } from 'react-router-dom';
import WrapperRouteComponent from '../WrapperRoute';
import LayoutPage from '@/Layout';

const NotFound = lazy(() => import('@/views/error/index'));
const LoginPage = lazy(() => import('@/views/login'));
const Dashboard = lazy(() => import('@/views/dashboard'));

export const defaultRouteList: RouteObject[] = [
  {
    path: '/login',
    element: <WrapperRouteComponent element={<LoginPage />} />
  },
  {
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} />,
    children: []
  }
];

export const errorRoute: RouteObject[] = [
  {
    path: '*',
    element: <WrapperRouteComponent element={<NotFound />} />
  }
];

//默认菜单
export const defaultMenuRoutes: MenuList = [
  {
    path: '/dashboard',
    key: '/dashboard',
    element: <WrapperRouteComponent element={<Dashboard />} />,
    meta: {}
  }
];
