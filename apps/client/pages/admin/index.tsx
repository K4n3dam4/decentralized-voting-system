import React from 'react';
import { NextPageContext } from 'next';
import { getServerSideProps as dvsGetServerSideProps } from '../../config/DVS';
import { ssrTranslations } from '../../utils/i18next';
import { Box } from '@chakra-ui/react';
import AdminOverview from '../../components/organisms/AdminOverview';
import makeRequest, { createBearer } from '../../utils/makeRequest';

export const getServerSideProps = async (ctx: NextPageContext) => {
  const dvsProps = dvsGetServerSideProps(ctx).props;

  try {
    const headers = createBearer(dvsProps.token);
    const stats = await makeRequest({ url: 'admin/overview', headers }, {}, true);

    return {
      props: {
        ...dvsProps,
        // locales
        ...(await ssrTranslations(ctx.locale, ['common'])),
        stats: stats.data,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
};

interface AdminPageProps {
  stats: AdminStats;
}

const AdminPage: React.FC<AdminPageProps> = ({ stats }) => {
  console.log(stats);
  return (
    <Box h="calc(100vh - 64px)" w="full" p={10} overflowY="auto">
      <AdminOverview stats={stats} />
    </Box>
  );
};

export default AdminPage;
