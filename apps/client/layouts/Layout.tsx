import React from 'react';
import { Box } from '@chakra-ui/react';
import Modals from '../components/organisms/Modals';

const Layout = ({ children }) => {
  return (
    <>
      <Box pt="64px">
        {children}
        <Modals />
      </Box>
    </>
  );
};

export default Layout;
