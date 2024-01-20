import { Button, Result } from 'antd';
import { FC } from 'react';

import { RouteProps, useNavigate, useLocation } from 'react-router-dom';

// import { useLocale } from '@/locales';
// import { userStore } from '@/stores/user';

const PrivateRoute: FC<RouteProps> = props => {
  // const { token } = userStore;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  // const { formatMessage } = useLocale();
  const { pathname } = useLocation();

  return token ? (
    props.element || null
  ) : (
    <Result
      status="403"
      title="403"
      subTitle="没有权限无法访问"
      extra={
        <Button
          type="primary"
          onClick={() => navigate({ pathname: 'login' }, { replace: true, state: { from: pathname } })}
        >
          回到登录页
        </Button>
      }
    />
  );
};

export default PrivateRoute;
