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
    const elections = await makeRequest({ url: 'admin/election/all', headers: createBearer(dvsProps.token) }, {}, true);
    const users = await makeRequest({ url: 'admin/user/all', headers: createBearer(dvsProps.token) }, {}, true);

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
  elections: any;
  users: any;
}

const AdminPage: React.FC<AdminPageProps> = ({ elections, users }) => {
  return (
    <Box h="calc(100vh - 64px)" w="full" p={10} overflowY="auto">
      <AdminOverview elections={elections} users={users} />
    </Box>
  );
};

export default AdminPage;
