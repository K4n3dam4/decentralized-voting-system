import { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import customTheme from '../config/theme/customTheme';
import DVSNavbar from '../components/molecules/DVSNavbar';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Decentralized electronic voting system</title>
      </Head>
      <main className="app">
        <ChakraProvider theme={customTheme}>
          <DVSNavbar />
          <Component {...pageProps} />
        </ChakraProvider>
      </main>
    </>
  );
}

export default CustomApp;
