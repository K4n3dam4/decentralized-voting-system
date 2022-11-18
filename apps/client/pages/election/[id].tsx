import React from 'react';
import { NextPageContext } from 'next';
import { getServerSideProps as dvsGetServerSideProps } from '../_app';
import makeRequest, { createBearer } from '../../utils/makeRequest';
import { ssrTranslations } from '../../utils/i18next';
import { Container } from '@chakra-ui/react';
import Election from '../../components/organisms/Election';

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
        election: election.data,
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
  election: Election;
}

const ElectionPage = ({ election }: ElectionPageProps) => {
  return (
    <Container maxW="7xl" alignItems="center" minH="100%" overflow="hidden" py={12}>
      <Election election={election} />
    </Container>
  );
};

export default ElectionPage;
