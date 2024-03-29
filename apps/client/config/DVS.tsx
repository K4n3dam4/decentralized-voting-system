import React, { useEffect } from 'react';
import { NextPageContext } from 'next';
import { ChakraProvider, cookieStorageManagerSSR, localStorageManager } from '@chakra-ui/react';
import '@fontsource/cabin/latin.css';
import { getCookie } from 'cookies-next';
import useUserStore from '../store/UserStore';
import chakraTheme from './theme/chakra.theme';

interface ChakraWrapperProps {
  cookies: string;
  token: string;
  children: React.ReactNode | React.ReactNode[];
}

export const getServerSideProps = (ctx: NextPageContext) => {
  const access_token = getCookie('access_token', ctx);

  return {
    props: {
      // all cookies
      cookies: ctx.req.headers.cookie ?? '',
      // jwt token
      token: access_token ?? '',
    },
  };
};

// DVS Config Wrapper
const DVS = ({ cookies, token, children }: ChakraWrapperProps) => {
  // manage color mode
  const colorModeManager = typeof cookies === 'string' ? cookieStorageManagerSSR(cookies) : localStorageManager;
  const [accessToken, setUser, resetUser] = useUserStore((s) => [s.access_token, s.setUser, s.resetUser]);

  // manage logged in user
  useEffect(() => {
    if (token) {
      if (token !== accessToken) {
        setUser(token);
      }
    } else {
      resetUser();
    }
  }, [token]);

  return (
    <ChakraProvider theme={chakraTheme} colorModeManager={colorModeManager}>
      {children}
    </ChakraProvider>
  );
};

export default DVS;
