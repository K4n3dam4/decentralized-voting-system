import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Modals from '../components/organisms/Modals';
import Sidebar from '../components/organisms/Sidebar';

const Layout = ({ children }) => {
  return (
    <Box pt="64px">
      <Flex width="100vw" overflowY="hidden">
        <Sidebar />
        {children}
      </Flex>
      <Modals />
    </Box>
  );
};

export default Layout;
