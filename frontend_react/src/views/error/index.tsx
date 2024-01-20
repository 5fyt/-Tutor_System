import { Result, Button } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle={'你访问的网页不存在'}
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          回到首页
        </Button>
      }
    ></Result>
  );
};
export default NotFoundPage;
