import React, { useEffect } from 'react';
import customTheme from '../config/theme/customTheme';
import { Box, ChakraProvider } from '@chakra-ui/react';
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
    <ChakraProvider theme={customTheme}>
      <Navbar />
      <Box pt="64px">{children}</Box>
    </ChakraProvider>
  );
};

export default Layout;
