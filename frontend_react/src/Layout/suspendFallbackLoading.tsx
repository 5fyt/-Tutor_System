import { Spin } from 'antd';
import { FC } from 'react';

export const SuspendFallbackLoading: FC = () => {
  return (
    <Spin
      size="large"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}
    ></Spin>
  );
};

export default SuspendFallbackLoading;
