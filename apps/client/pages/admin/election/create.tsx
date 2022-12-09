import React from 'react';
import { getServerSideProps as dvsGetServerSideProps } from '../../../config/DVS';
import { ssrTranslations } from '../../../utils/i18next';
import { Box } from '@chakra-ui/react';
import AdminCreate from '../../../components/organisms/AdminCreate';

export const getServerSideProps = async (ctx) => {
  return {
    props: {
      ...dvsGetServerSideProps(ctx).props,
      // locales
      ...(await ssrTranslations(ctx.locale, ['common'])),
    },
  };
};

const AdminCreatePage = () => {
  return (
    <Box w="full" px={20} py={10}>
      <AdminCreate type="election" />
    </Box>
  );
};

export default AdminCreatePage;
