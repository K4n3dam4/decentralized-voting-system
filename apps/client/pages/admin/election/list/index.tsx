import React from 'react';
import { getServerSideProps as dvsGetServerSideProps } from '../../../../config/DVS';
import { ssrTranslations } from '../../../../utils/i18next';
import { Box } from '@chakra-ui/react';
import AdminList from '../../../../components/organisms/AdminList';
import makeRequest, { createBearer } from '../../../../utils/makeRequest';

export const getServerSideProps = async (ctx) => {
  const dvsProps = dvsGetServerSideProps(ctx).props;

  try {
    const { data: elections } = await makeRequest(
      { url: 'admin/election/all', headers: createBearer(dvsProps.token) },
      {},
      true,
    );

    return {
      props: {
        ...dvsProps,
        // locales
        ...(await ssrTranslations(ctx.locale, ['common'])),
        elections,
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

interface AdminListPageProps {
  elections: AdminElection[];
}

const AdminListPage: React.FC<AdminListPageProps> = ({ elections }) => {
  return (
    <Box h="calc(100vh - 64px)" w="full" p={10} overflowY="auto">
      <AdminList type="election" list={elections} />
    </Box>
  );
};

export default AdminListPage;
