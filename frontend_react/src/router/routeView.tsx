import { FC, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import SuspendFallbackLoading from '@/Layout/suspendFallbackLoading';

export const RouteView: FC = () => {
  return (
    <Suspense fallback={<SuspendFallbackLoading />}>
      <Outlet />
    </Suspense>
  );
};

export default RouteView;
