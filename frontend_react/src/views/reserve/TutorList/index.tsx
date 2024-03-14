import { FC, memo, useCallback, useEffect, useState, useRef } from 'react';
import { CheckSquareOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, message } from 'antd';
import { getTutorListByRole } from '@/api/system/tutor';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import './index.less';
import AddReserve from '../ReserveMange/AddReserve';
import { updateReserveStatus } from '@/api/system/reserve';
const { Meta } = Card;
interface ModalProps {
  showModal: (value?: any) => void;
}
const TutorList: FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [tutorData, setTutorData] = useState([]);
  const innerRef = useRef<ModalProps>(null);
  const onChange: PaginationProps['onChange'] = (current, pageSize) => {
    console.log(current, pageSize);
    setPage(current);
    setLimit(pageSize);
    getTutorData({ page: current, limit: pageSize });
  };
  const getTutorData = useCallback(
    async (info?: any) => {
      const { list, total } = await getTutorListByRole({ limit, page, ...info });
      setTutorData(list);
      setTotal(total);
    },
    [limit, page]
  );
  const reserveHandle = (item: any) => {
    innerRef.current?.showModal(item);
  };
  const confirmServe = async (item: any) => {
    const { code } = await updateReserveStatus({ id: item.id });
    code === 200 ? message.info('完成预约订单') : message.error('结算失败');
  };
  useEffect(() => {
    getTutorData();
  }, [getTutorData]);
  return (
    <div className="tutor_info">
      <div className="tutor_card_list">
        {tutorData.map((item: any, key: any) => {
          return (
            <div className="card_list" key={key}>
              <Card
                style={{ width: 300 }}
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    style={{ height: '120px', objectFit: 'cover' }}
                  />
                }
                actions={[
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{ color: '#45956A', marginRight: '5px' }} onClick={() => confirmServe(item)}>
                      确定预约
                    </span>
                    <div onClick={() => reserveHandle(item)}>
                      <span style={{ color: '#040404', marginRight: '3px' }}>预约课程</span>
                      <CheckSquareOutlined />
                    </div>
                  </div>
                ]}
              >
                <Meta
                  avatar={
                    item?.user_head_image ? <Avatar src={item?.user_head_image} /> : <Avatar icon={<UserOutlined />} />
                  }
                  title={
                    <div>
                      <span>{item.course}</span>
                      <span>{item.grade}</span>
                    </div>
                  }
                  description={
                    <div className="description">
                      <p>姓名：{item.user_name}</p>
                      <p>地址：{item.address}</p>
                      <p>联系电话：{item.user_phone || '待完善'}</p>
                      <p>要求：{item.description}</p>
                      <p>金额：{item.money}每小时</p>
                    </div>
                  }
                />
              </Card>
            </div>
          );
        })}
      </div>
      <Pagination showSizeChanger onChange={onChange} total={total} />
      <AddReserve innerRef={innerRef} />
    </div>
  );
};
export default memo(TutorList);
