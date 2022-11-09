import { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../layouts/Layout';
import DVS from '../config/DVS';
import { appWithTranslation } from 'next-i18next';
import Navbar from '../components/organisms/Navbar';
import React from 'react';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Decentralized electronic voting system</title>
      </Head>
      <main className="app">
        <DVS cookies={pageProps.cookies} token={pageProps.token}>
          <Navbar />
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
