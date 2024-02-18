import { FC, useEffect, useMemo } from 'react';
import { cloneDeep } from 'lodash';
import { useLocation, type RouteObject, useNavigate } from 'react-router-dom';
// import type { MenuList } from './type';
// import WrapperRouteComponent from './WrapperRoute';
import { defaultRouteList, errorRoute, defaultRoutes } from './routeList/staticRoute';
// import LayoutPage from '@/Layout';
import RenderRoute from './RenderRoute';
import Storage from '@/utils/Storage';
import { ACCESS_TOKEN_KEY } from '@/enums/cacheEnum';
import { dynamicRouteList } from './routeList/dynamicRoute';

export const DynamicRouter: FC = () => {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const token = Storage.get(ACCESS_TOKEN_KEY, null);

  //判断token鉴权
  useEffect(() => {
    if (!token && pathname !== '/login') {
      return navigate({ pathname: '/login' }, { replace: true, state: { from: pathname } });
    }
    if (token) {
      if (pathname === '/login') {
        return navigate({ pathname: '/' }, { replace: true });
      }
    }
  }, [pathname, state, token, navigate]);

  const newRoutes = useMemo(() => {
    const routes = cloneDeep(defaultRouteList);
    const layoutRoute = routes.find((item: RouteObject) => item.path === '/')?.children;
    layoutRoute?.push(...cloneDeep([...defaultRoutes, ...dynamicRouteList]), ...errorRoute);
    return routes;
  }, []);
  return <RenderRoute routeList={newRoutes} />;
};
export default DynamicRouter;
