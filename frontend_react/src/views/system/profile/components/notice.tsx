import { FC, memo, useCallback, useEffect, useState } from 'react';
import { List, Typography, message as Message } from 'antd';
import { deleteMessage, getNoticeList } from '@/api/system/user';

const Notice: FC = () => {
  const [message, setMessage] = useState<any>([]);
  const getMessages = useCallback(async () => {
    const message = await getNoticeList();
    setMessage(message);
  }, []);
  const deleteMessages = async (id: number) => {
    console.log(1);
    await deleteMessage({ messageIds: [id] });
    Message.info('已删除');
    getMessages();
  };
  useEffect(() => {
    getMessages();
  }, [getMessages]);
  return (
    <List
      bordered
      dataSource={message}
      renderItem={(item: any) => (
        <List.Item>
          <Typography.Text mark onClick={() => deleteMessages(item.id)}>
            [新消息]
          </Typography.Text>
          {item?.message}
        </List.Item>
      )}
    />
  );
};
export default memo(Notice);
