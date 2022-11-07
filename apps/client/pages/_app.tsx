import { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../layouts/Layout';
import DVS from '../config/DVS';
import { appWithTranslation } from 'next-i18next';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Decentralized electronic voting system</title>
      </Head>
      <main className="app">
        <DVS cookies={pageProps.cookies} token={pageProps.token}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </DVS>
      </main>
    </>
  );
}

// re-export dvs getServerSideProps function
export { getServerSideProps } from '../config/DVS';

export default appWithTranslation(CustomApp);
