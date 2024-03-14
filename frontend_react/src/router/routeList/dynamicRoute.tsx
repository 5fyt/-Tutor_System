import { lazy } from 'react';
import { MenuList } from '../type';
import WrapperRouteElement from '../WrapperRoute';
import { RouteObject } from 'react-router-dom';
import { ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER } from '../../enums/menuEnum';
const NoticeList = lazy(() => import('@/views/notice'));
const Profile = lazy(() => import('@/views/system/profile'));
const Order = lazy(() => import('@/views/system/order'));
const Comment = lazy(() => import('@/views/system/comment'));
const CourseList = lazy(() => import('@/views/permission/course'));
const Role = lazy(() => import('@/views/permission/role'));
const User = lazy(() => import('@/views/permission/user'));
const PerfAnalysis = lazy(() => import('@/views/student/PerfAnalysis'));
const PerfOrder = lazy(() => import('@/views/student/PerfOrder'));
const TutorInfo = lazy(() => import('@/views/student/TutorInfo'));
const ReserveTutor = lazy(() => import('@/views/reserve/TutorList'));
const ReserveManage = lazy(() => import('@/views/reserve/ReserveMange'));
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
    path: '/permission/courseList',
    element: <WrapperRouteElement element={<CourseList />} />
  },
  {
    path: '/permission/role',
    element: <WrapperRouteElement element={<Role />} />
  },
  {
    path: '/permission/user',
    element: <WrapperRouteElement element={<User />} />
  },
  {
    path: '/student/perfAnalysis',
    element: <WrapperRouteElement element={<PerfAnalysis />} />
  },
  {
    path: '/student/perfOrder',
    element: <WrapperRouteElement element={<PerfOrder />} />
  },
  {
    path: '/student/tutorInfo',
    element: <WrapperRouteElement element={<TutorInfo />} />
  },

  {
    path: '/teacher/tutorInfo',
    element: <WrapperRouteElement element={<TutorInfo />} />
  },
  {
    path: '/reserve/tutorInfo',
    element: <WrapperRouteElement element={<ReserveTutor />} />
  },
  {
    path: '/reserve/manage',
    element: <WrapperRouteElement element={<ReserveManage />} />
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
        path: '/permission/user',
        key: '/permission/user',
        name: '用户管理',
        meta: {
          icon: 'DeliveredProcedureOutlined',
          role: [ROLE_ADMIN]
        }
      },
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
        path: '/permission/courseList',
        key: '/permission/courseList',
        name: '课程列表',
        meta: {
          icon: 'DeleteColumnOutlined',
          role: [ROLE_ADMIN]
        }
      }
    ]
  },
  {
    path: 'student',
    name: '学生管理',
    key: 'student',
    meta: {
      icon: 'UserSwitchOutlined',
      role: [ROLE_ADMIN, ROLE_STUDENT]
    },
    children: [
      {
        path: '/student/perfAnalysis',
        key: '/student/perfAnalysis',
        name: '成绩分析',
        meta: {
          icon: 'FileSearchOutlined',
          role: [ROLE_ADMIN, ROLE_STUDENT]
        }
      },
      {
        path: '/student/perfOrder',
        key: '/student/perfOrder',
        name: '成绩单',
        meta: {
          icon: 'FileTextOutlined',
          role: [ROLE_ADMIN, ROLE_STUDENT]
        }
      },

      {
        path: '/student/tutorInfo',
        key: '/student/tutorInfo',
        name: '家教信息',
        meta: {
          icon: 'MessageOutlined',
          role: [ROLE_ADMIN, ROLE_STUDENT]
        }
      }
    ]
  },
  {
    path: 'teacher',
    name: '教师管理',
    key: 'teacher',
    meta: {
      icon: 'UserSwitchOutlined',
      role: [ROLE_ADMIN, ROLE_STUDENT]
    },
    children: [
      {
        path: '/teacher/tutorInfo',
        key: '/teacher/tutorInfo',
        name: '家教信息',
        meta: {
          icon: 'MessageOutlined',
          role: [ROLE_ADMIN, ROLE_STUDENT]
        }
      }
    ]
  },
  {
    path: 'reserve',
    name: '预约管理',
    key: 'reserve',
    meta: {
      icon: 'CalendarOutlined',
      role: [ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER]
    },
    children: [
      {
        path: '/reserve/tutorInfo',
        name: '家教信息',
        key: '/reserve/tutorInfo',
        meta: {
          icon: 'GoldOutlined',
          role: [ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER]
        }
      },
      {
        path: '/reserve/manage',
        key: '/reserve/manage',
        name: '预约管理',
        meta: {
          icon: 'FunnelPlotOutlined',
          role: [ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER]
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
