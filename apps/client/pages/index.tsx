import { Box, Container, SimpleGrid, Stack } from '@chakra-ui/react';
import Register from '../components/organisms/Register';
import DVSHeroIcon from '../components/atoms/DVSHeroIcon';
import DVSAvatarGroup from '../components/molecules/DVSAvatarGroup';
import DVSHeroHeading from '../components/molecules/DVSHeroHeading';

const Home = () => {
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
    <Box position="relative">
      <Container
        as={SimpleGrid}
        maxW="7xl"
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
      >
        <Stack spacing={{ base: 10, md: 20 }}>
          <DVSHeroHeading
            heading1="Your decentralized voting system"
            heading2="Millions of voters have joined. Would you like to be next?"
            emphasize="decentralized"
          />
          <DVSAvatarGroup avatars={avatars} user />
        </Stack>
        <Register />
      </Container>
      <DVSHeroIcon position="absolute" zIndex={-10} top={100} left={15} style={{ filter: 'blur(70px)' }} />
    </Box>
  );
};

export default Home;
