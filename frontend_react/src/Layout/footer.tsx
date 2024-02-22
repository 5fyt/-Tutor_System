import React, { memo, useEffect, useState } from 'react';

import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';

const { Footer } = Layout;
const FooterBar: React.FC = () => {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (pathname === '/dashboard' || pathname === '/permission/perList') {
      setShow(true);
    }
  }, [pathname]);

  return (
    <>
      <Footer
        style={{
          textAlign: 'center',
          backgroundColor: '#f0f2f5 ',
          paddingBottom: show ? '' : '100px'
        }}
      >
        Tutor System ©2024 Created by FPH.
      </Footer>
    </>
  );
};
export default memo(FooterBar);
