import { lazy } from 'react';
import { MenuList } from '../type';
import WrapperRouteElement from '../WrapperRoute';
import { RouteObject } from 'react-router-dom';
import { ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER } from '../../enums/menuEnum';
const NoticeList = lazy(() => import('@/views/notice'));
const Profile = lazy(() => import('@/views/system/profile'));
const Order = lazy(() => import('@/views/system/order'));
const Comment = lazy(() => import('@/views/system/comment'));
const PermissionList = lazy(() => import('@/views/permission/permissionList'));
const Role = lazy(() => import('@/views/permission/role'));
const User = lazy(() => import('@/views/permission/user'));

export const dynamicRouteList: RouteObject[] = [
  {
    path: '/notice',
    element: <WrapperRouteElement element={<NoticeList />} />
  },
  {
    path: '/system/profile',
    element: <WrapperRouteElement element={<Profile />} />
  },
  {
    path: '/system/order',
    element: <WrapperRouteElement element={<Order />} />
  },
  {
    path: '/system/comment',
    element: <WrapperRouteElement element={<Comment />} />
  },
  {
    path: '/permission/perlist',
    element: <WrapperRouteElement element={<PermissionList />} />
  },
  {
    path: '/permission/role',
    element: <WrapperRouteElement element={<Role />} />
  },
  {
    path: '/permission/user',
    element: <WrapperRouteElement element={<User />} />
  }
];
export const dynamicMenuRoute: MenuList = [
  {
    path: '/dashboard',
    key: '/dashboard',
    name: '首页',
    meta: {
      icon: 'DashboardOutlined',
      role: [ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER]
    }
  },

  {
    path: 'permission',
    key: 'permission',
    name: '权限管理',
    meta: {
      icon: 'TeamOutlined',
      role: [ROLE_ADMIN]
    },
    children: [
      {
        path: '/permission/role',
        key: '/permission/role',
        name: '角色管理',
        meta: {
          icon: 'ControlOutlined',
          role: [ROLE_ADMIN]
        }
      },
      {
        path: '/permission/perList',
        key: '/permission/perList',
        name: '权限列表',
        meta: {
          icon: 'DeleteColumnOutlined',
          role: [ROLE_ADMIN]
        }
      },
      {
        path: '/permission/user',
        key: '/permission/user',
        name: '角色管理',
        meta: {
          icon: 'DeliveredProcedureOutlined',
          role: [ROLE_ADMIN]
        }
      }
    ]
  },
  {
    path: 'system',
    name: '系统管理',
    key: 'system',
    meta: {
      icon: 'RadiusSettingOutlined',
      role: [ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER]
    },
    children: [
      {
        path: '/system/profile',
        name: '个人设置',
        key: '/system/profile',
        meta: {
          icon: 'GoldOutlined',
          role: [ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER]
        }
      },
      {
        path: '/system/order',
        key: '/system/order',
        name: '订单管理',
        meta: {
          icon: 'FunnelPlotOutlined',
          role: [ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER]
        }
      },
      {
        path: '/system/comment',
        key: '/system/commnent',
        name: '评价记录',
        meta: {
          icon: 'FileOutlined',
          role: [ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER]
        }
      }
    ]
  }
];
