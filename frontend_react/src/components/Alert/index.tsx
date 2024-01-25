import { Alert } from 'antd';
import { FC } from 'react';

const AlertMessage: FC<{ content: string }> = ({ content }) => <Alert message={content} type="error" showIcon></Alert>;

export default AlertMessage;
