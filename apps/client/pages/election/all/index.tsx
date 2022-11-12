import React from 'react';
import { NextPageContext } from 'next';
import { getServerSideProps as dvsGetServerSideProps } from '../../_app';
import { ssrTranslations } from '../../../utils/i18next';
import { Box } from '@chakra-ui/react';
import Elections from '../../../components/organisms/Elections';
import DVSHeroIcon from '../../../components/atoms/DVSHeroIcon';
import makeRequest, { createBearer } from '../../../utils/makeRequest';

export const getServerSideProps = async (ctx: NextPageContext) => {
  const dvsProps = dvsGetServerSideProps(ctx).props;

  try {
    const elections = await makeRequest<Election[]>(
      { url: 'election/all', headers: createBearer(dvsProps.token) },
      {},
      true,
    );

    return {
      props: {
        ...dvsProps,
        // locales
        ...(await ssrTranslations(ctx.locale, ['common'])),
        elections: elections.data,
      },
    };
  } catch (e) {
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

const Election = ({ elections }: ElectionPageProps) => {
  return (
    <Box height="calc(100vh - 64px)" width="100vw" position="relative">
      <DVSHeroIcon position="absolute" zIndex={-10} left={{ base: 0, sm: 0 }} style={{ filter: 'blur(70px)' }} />
      <Elections elections={elections} />
    </Box>
  );
};

export default Election;
