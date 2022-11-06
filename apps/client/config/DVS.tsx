import React, { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { ChakraProvider, cookieStorageManagerSSR, localStorageManager } from '@chakra-ui/react';
import '@fontsource/cabin/latin.css';
import '@fontsource/montserrat/latin.css';
import { getCookie } from 'cookies-next';
import useUserStore from '../store/UserStore';
import chakraTheme from './theme/chakra.theme';

interface ChakraWrapperProps {
  cookies: string;
  token: string;
  children: React.ReactNode | React.ReactNode[];
}

const DVS = ({ cookies, token, children }: ChakraWrapperProps) => {
  const colorModeManager = typeof cookies === 'string' ? cookieStorageManagerSSR(cookies) : localStorageManager;
  const [accessToken, setUser, resetUser] = useUserStore((s) => [s.access_token, s.setUser, s.resetUser]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (token) {
      if (token !== accessToken) {
        setUser(token);
      }
    } else {
      resetUser();
    }
    setLoaded(true);
  }, [token]);

  return (
    <ChakraProvider theme={chakraTheme} colorModeManager={colorModeManager}>
      {loaded && children}
    </ChakraProvider>
  );
};

export const getServerSideProps = (ctx: NextPageContext) => {
  const access_token = getCookie('access_token', ctx);

  return {
    props: {
      cookies: ctx.req.headers.cookie ?? '',
      token: access_token ?? '',
    },
  };
};

export default DVS;
