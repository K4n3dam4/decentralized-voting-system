import React from 'react';
import { NextPageContext } from 'next';
import { getServerSideProps as dvsGetServerSideProps } from '../../config/DVS';
import { ssrTranslations } from '../../utils/i18next';

export const getServerSideProps = async (ctx: NextPageContext) => {
  return {
    props: {
      ...dvsGetServerSideProps(ctx).props,
      // locales
      ...(await ssrTranslations(ctx.locale, ['common'])),
    },
  };
};

const AdminPage = (props) => {
  return <span>Test</span>;
};

export default AdminPage;
