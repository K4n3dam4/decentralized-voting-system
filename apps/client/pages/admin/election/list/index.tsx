import React from 'react';
import { getServerSideProps as dvsGetServerSideProps } from '../../../../config/DVS';
import { ssrTranslations } from '../../../../utils/i18next';
import { Box } from '@chakra-ui/react';
import AdminList from '../../../../components/organisms/AdminList';

export const getServerSideProps = async (ctx) => {
  return {
    props: {
      ...dvsGetServerSideProps(ctx).props,
      // locales
      ...(await ssrTranslations(ctx.locale, ['common'])),
    },
  };
};

const AdminListPage = () => {
  return (
    <Box h="calc(100vh - 64px)" w="full" p={10} overflowY="auto">
      <AdminList type="election" />
    </Box>
  );
};

export default AdminListPage;
