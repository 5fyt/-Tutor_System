import './index.less';

import { Layout } from 'antd';
import { FC, useEffect, useState, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { RouteView } from '@/router/routeView';
// import { userStore } from '@/stores/user';

import HeaderComponent from './header';
import MenuComponent from './menu';
import { useAppSelector } from '@/store';
// import TagsView from './tagView';

const { Content, Sider } = Layout;

const LayoutPage: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuList = useAppSelector(state => state.login.menuList);
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [navigate, location]);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="layout-page">
      <HeaderComponent collapsed={collapsed} toggle={toggle} />
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
