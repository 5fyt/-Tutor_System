import './index.less';
import { Layout } from 'antd';
import { FC, useEffect, useState, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RouteView } from '@/router/routeView';
import HeaderComponent from './header';
import MenuComponent from './menu';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleCollapsed } from '../store/module/login';
import BreadcrumbView from './breadcrumbView';
import FooterBar from './footer';
const { Content, Sider } = Layout;

const LayoutPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = useAppSelector(state => state.login.collapsed);
  const dispatch = useAppDispatch();
  const menuList = useAppSelector(state => state.login.menuList);
  const [heightView, setHeightView] = useState(0);
  //计算内容区高度
  const caculateHeight = () => {
    const clientHeight = document.documentElement.clientHeight - 48 - 48;
    setHeightView(clientHeight);
  };
  useEffect(() => {
    caculateHeight();
  }, []);
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [navigate, location]);
  //浏览器改变尺寸时
  window.onresize = () => {
    caculateHeight();
  };
  return (
    <Layout className="layout-page">
      <HeaderComponent collapsed={collapsed} toggle={() => dispatch(toggleCollapsed())} />
      <Layout>
        <Sider
          className="layout-page-sider"
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          width={250}
        >
          <MenuComponent menuList={menuList} />
        </Sider>
        <Content
          className="layout-page-content"
          style={{
            overflow: 'initial',
            minHeight: `${heightView - 112}px`
          }}
        >
          {/* <TagsView /> */}
          <BreadcrumbView />
          <RouteView />
          <FooterBar />
        </Content>
      </Layout>
    </Layout>
  );
};

export default memo(LayoutPage);
