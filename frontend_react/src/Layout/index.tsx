import './index.less';

import { Layout } from 'antd';
import { FC, useEffect, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RouteView } from '@/router/routeView';
// import { userStore } from '@/stores/user';

import HeaderComponent from './header';
import MenuComponent from './menu';
import { useAppDispatch, useAppSelector } from '@/store';
// import TagsView from './tagView';
import { toggleCollapsed } from '../store/module/login';
const { Content, Sider } = Layout;

const LayoutPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = useAppSelector(state => state.login.collapsed);
  const dispatch = useAppDispatch();
  const menuList = useAppSelector(state => state.login.menuList);
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [navigate, location]);

  return (
    <Layout className="layout-page">
      <HeaderComponent collapsed={collapsed} toggle={() => dispatch(toggleCollapsed())} />
      <Layout>
        <Sider className="layout-page-sider" trigger={null} collapsible collapsed={collapsed} breakpoint="md">
          <MenuComponent menuList={menuList} />
        </Sider>
        <Content className="layout-page-content">
          {/* <TagsView /> */}
          <RouteView />
        </Content>
      </Layout>
    </Layout>
  );
};

export default memo(LayoutPage);
