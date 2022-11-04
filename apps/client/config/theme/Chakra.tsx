import React from 'react';
import { NextPageContext } from 'next';
import { ChakraProvider, cookieStorageManagerSSR, localStorageManager } from '@chakra-ui/react';
import chakraTheme from './chakra.theme';

interface ChakraWrapperProps {
  cookies: string;
  children: React.ReactNode | React.ReactNode[];
}

const Chakra = ({ cookies, children }: ChakraWrapperProps) => {
  console.log(cookies);
  const colorModeManager = typeof cookies === 'string' ? cookieStorageManagerSSR(cookies) : localStorageManager;

  return (
    <ChakraProvider theme={chakraTheme} colorModeManager={colorModeManager}>
      {children}
    </ChakraProvider>
  );
};

export const getServerSideProps = ({ req }: NextPageContext) => {
  return {
    props: {
      cookies: req.headers.cookie ?? '',
    },
  };
};

export default Chakra;
