import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { getCookie } from 'cookies-next';
import useAuthStore from '../store/UserStore';
import Navbar from '../components/organisms/Navbar';

const Layout = ({ children }) => {
  const [access_token, setUser] = useAuthStore((s) => [s.access_token, s.setUser]);

  useEffect(() => {
    const cookie = getCookie('access_token') as string;
    if (cookie) {
      if (access_token !== cookie) setUser(cookie);
    }
  }, [children]);

  return (
    <>
      <Navbar />
      <Box pt="64px">{children}</Box>
    </>
  );
};

export default Layout;
