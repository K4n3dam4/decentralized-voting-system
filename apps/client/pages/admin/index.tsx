import React from 'react';
import { NextPageContext } from 'next';
import { getServerSideProps as dvsGetServerSideProps } from '../../config/DVS';
import { ssrTranslations } from '../../utils/i18next';
import { Box } from '@chakra-ui/react';
import Sidebar from '../../components/organisms/Sidebar';
import AdminOverview from '../../components/organisms/AdminOverview';
import makeRequest, { createBearer } from '../../utils/makeRequest';

export const getServerSideProps = async (ctx: NextPageContext) => {
  const dvsProps = dvsGetServerSideProps(ctx).props;

  try {
    const elections = await makeRequest({ url: 'admin/election/all', headers: createBearer(dvsProps.token) }, {}, true);

    console.log(elections.data);

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

interface AdminPageProps {
  elections: any;
}

const AdminPage: React.FC<AdminPageProps> = ({ elections }) => {
  return (
    <Box height="calc(100vh - 64px)" width="100vw" display="flex" overflow="hidden">
      <Sidebar />
      <AdminOverview elections={elections} />
    </Box>
  );
};

export default AdminPage;
