import { FC, memo, useCallback, useEffect, useState } from 'react';
import { CheckSquareOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { getTutorListByRole } from '@/api/system/tutor';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import './index.less';
const { Meta } = Card;
const TutorList: FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [tutorData, setTutorData] = useState([]);
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
  useEffect(() => {
    getTutorData();
  }, [getTutorData]);
  return (
    <div className="tutor_info">
      <div className="tutor_card_list">
        {tutorData.map((item: any, key: any) => {
          return (
            <div className="card_list">
              <Card
                key={key}
                style={{ width: 300 }}
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    style={{ height: '120px', objectFit: 'cover' }}
                  />
                }
                actions={[
                  <div>
                    <span style={{ color: 'red', marginRight: '3px' }}>预约课程</span>
                    <CheckSquareOutlined />
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
                      <p>{item.user_name}</p>
                      <p>{item.address}</p>
                      <p>{item.user_phone}</p>
                      <p>{item.description}</p>
                    </div>
                  }
                />
              </Card>
            </div>
          );
        })}
      </div>
      <Pagination showSizeChanger onChange={onChange} total={total} />
    </div>
  );
};
export default memo(TutorList);
