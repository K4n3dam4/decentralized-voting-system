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
    const users = await makeRequest({ url: 'admin/user/all', headers: createBearer(dvsProps.token) }, {}, true);

    console.log(users.data);

    return {
      props: {
        ...dvsProps,
        // locales
        ...(await ssrTranslations(ctx.locale, ['common'])),
        elections: elections.data,
        users: users.data,
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

interface AdminPageProps {
  elections: any;
  users: any;
}

const AdminPage: React.FC<AdminPageProps> = ({ elections, users }) => {
  return (
    <Box height="calc(100vh - 64px)" width="100vw" display="flex" overflow="hidden">
      <Sidebar />
      <Box h="full" w="full" p={10} overflowY="auto">
        <AdminOverview elections={elections} users={users} />
      </Box>
    </Box>
  );
};

export default AdminPage;
