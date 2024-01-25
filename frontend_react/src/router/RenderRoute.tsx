import React, { FC, Suspense } from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import SuspendFallbackLoading from '@/Layout/suspendFallbackLoading';
interface RouteProps {
  routeList: RouteObject[];
}

const RenderRoute: FC<RouteProps> = ({ routeList }): React.ReactNode => {
  const element = useRoutes(routeList);
  return <Suspense fallback={<SuspendFallbackLoading message="加载失败" />}>{element}</Suspense>;
};

export default RenderRoute;
