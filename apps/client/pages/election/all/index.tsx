import React from 'react';
import { NextPageContext } from 'next';
import { getServerSideProps as dvsGetServerSideProps } from '../../_app';
import { ssrTranslations } from '../../../utils/i18next';

export const getServerSideProps = async (ctx: NextPageContext) => {
  return {
    props: {
      ...dvsGetServerSideProps(ctx).props,
      // locales
      ...(await ssrTranslations(ctx.locale, ['common'])),
    },
  };
};

const Election = (props) => {
  return <div>Test</div>;
};

export default Election;
