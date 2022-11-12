import React from 'react';
import { NextPageContext } from 'next';
import { getServerSideProps as dvsGetServerSideProps } from '../_app';
import makeRequest, { createBearer } from '../../utils/makeRequest';
import { ssrTranslations } from '../../utils/i18next';
import { Box } from '@chakra-ui/react';

export const getServerSideProps = async (ctx: NextPageContext) => {
  const dvsProps = dvsGetServerSideProps(ctx).props;
  const { id } = ctx.query;

  try {
    const election = await makeRequest<Election[]>(
      { url: `election/single/${id}`, headers: createBearer(dvsProps.token) },
      {},
      true,
    );

    return {
      props: {
        ...dvsProps,
        // locales
        ...(await ssrTranslations(ctx.locale, ['common'])),
        elections: election.data,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
};

interface ElectionPageProps {
  elections: any;
}

const ElectionPage = ({ elections }: ElectionPageProps) => {
  return <Box height="calc(100vh - 64px)" width="100vw" position="relative"></Box>;
};

export default ElectionPage;
