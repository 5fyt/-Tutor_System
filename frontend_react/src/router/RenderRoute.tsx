import React, { FC, Suspense } from 'react';
import { Spin } from 'antd';
import { RouteObject, useRoutes } from 'react-router-dom';
interface RouteProps {
  routeList: RouteObject[];
}

const RenderRoute: FC<RouteProps> = ({ routeList }): React.ReactNode => {
  const element = useRoutes(routeList);
  return (
    <Suspense
      fallback={
        <Spin
          size="large"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
        />
      }
    >
      {element}
    </Suspense>
  );
};

export default RenderRoute;
