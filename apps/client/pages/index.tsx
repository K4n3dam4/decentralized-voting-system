import { Box, Container, SimpleGrid, Stack } from '@chakra-ui/react';
import Auth from '../components/organisms/Auth';
import DVSHeroIcon from '../components/atoms/DVSHeroIcon';
import DVSAvatarGroup from '../components/molecules/DVSAvatarGroup';
import DVSHeroHeading from '../components/molecules/DVSHeroHeading';
import { getServerSideProps as dvsGetServerSideProps } from './_app';
import { ssrTranslations } from '../utils/i18next';
import { useTranslation } from 'next-i18next';

export const getServerSideProps = async (ctx) => {
  return {
    props: {
      ...dvsGetServerSideProps(ctx).props,
      // locales
      ...(await ssrTranslations(ctx.locale, ['common'])),
    },
  };
};

const Home = () => {
  const { t } = useTranslation();
  const avatars = [
    {
      name: 'Ryan Florence',
      url: 'https://bit.ly/ryan-florence',
    },
    {
      name: 'Segun Adebayo',
      url: 'https://bit.ly/sage-adebayo',
    },
    {
      name: 'Kent Dodds',
      url: 'https://bit.ly/kent-c-dodds',
    },
    {
      name: 'Prosper Otemuyiwa',
      url: 'https://bit.ly/prosper-baba',
    },
    {
      name: 'Christian Nwamba',
      url: 'https://bit.ly/code-beast',
    },
  ];

  return (
    <Box height={{ base: 'auto', sm: 'calc(100vh - 64px)' }} width="100vw" display="flex" alignItems="center">
      <Container
        as={SimpleGrid}
        maxW="7xl"
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        alignItems="center"
        height="100%"
        py={12}
      >
        <Stack spacing={{ base: 10, md: 20 }}>
          <DVSHeroHeading
            heading1={t('hero.landing.heading')}
            heading2={t('hero.landing.subHeading')}
            emphasize="decentralized"
          />
          <DVSAvatarGroup avatars={avatars} user />
        </Stack>
        <Auth />
      </Container>
      <DVSHeroIcon
        position="absolute"
        zIndex={-10}
        top={100}
        left={{ base: 0, sm: 15 }}
        style={{ filter: 'blur(70px)' }}
      />
    </Box>
  );
};

export default Home;
