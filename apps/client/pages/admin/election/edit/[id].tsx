import React from 'react';
import { getServerSideProps as dvsGetServerSideProps } from '../../../../config/DVS';
import { Box } from '@chakra-ui/react';
import { ssrTranslations } from '../../../../utils/i18next';

export const getServerSideProps = async (ctx) => {
  return {
    props: {
      ...dvsGetServerSideProps(ctx).props,
      // locales
      ...(await ssrTranslations(ctx.locale, ['common'])),
    },
  };
};

const AdminEditPage = () => {
  return <Box w="full" px={20} py={10}></Box>;
};

export default AdminEditPage;
