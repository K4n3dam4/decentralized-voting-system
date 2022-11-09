import React from 'react';
import { Box } from '@chakra-ui/react';

const Layout = ({ children }) => {
  return (
    <>
      <Box pt="64px">{children}</Box>
    </>
  );
};

export default Layout;
