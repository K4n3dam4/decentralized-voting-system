import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from '../components/organisms/Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Box pt="64px">{children}</Box>
    </>
  );
};

export default Layout;
