import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.less';
const DashBoard: FC = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard_card">
      <div className="item-card" onClick={() => navigate({ pathname: '/system/profile' })}>
        消息模块
      </div>
      <div className="item-card" onClick={() => navigate({ pathname: '/reserve/tutorInfo' })}>
        家教信息
      </div>
      <div className="item-card" onClick={() => navigate({ pathname: '/reserve/manage' })}>
        预约管理
      </div>
    </div>
  );
};
export default DashBoard;
