import { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../layouts/Layout';
import Chakra from '../config/theme/Chakra';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Decentralized electronic voting system</title>
      </Head>
      <main className="app">
        <Chakra cookies={pageProps.cookies}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Chakra>
      </main>
    </>
  );
}

// re-export the reusable `getServerSideProps` function
export { getServerSideProps } from '../config/theme/Chakra';

export default CustomApp;
