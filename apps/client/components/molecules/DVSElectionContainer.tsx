import React from 'react';
import {
  Box,
  Container,
  ContainerProps,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import DVSButton from '../atoms/DVSButton';
import DVSHeroIcon from '../atoms/DVSHeroIcon';

export interface DVSElectionContainer extends ContainerProps {
  election: Election;
}

const DVSElectionContainer: React.FC<DVSElectionContainer> = ({ election, ...containerProps }) => {
  return (
    <Container
      as={SimpleGrid}
      height="calc(100vh - 64px)"
      maxW="7xl"
      alignItems="center"
      columns={{ base: 1, md: 2 }}
      spacing={{ base: 4, md: 10, lg: 20 }}
      py={12}
      position="relative"
      {...containerProps}
    >
      <Box w={{ base: '100%' }}>
        <Image alt="election" src={election.image} />
      </Box>
      <Box display="flex" flex="1" flexDirection="column" justifyContent="center">
        <Heading lineHeight={1.3}>
          <Link href="/">{election.name}</Link>
        </Heading>
        <Stack spacing={5}>
          <Text as="p" marginTop={10} color={useColorModeValue('gray.700', 'gray.200')} fontSize="lg">
            {election.description}
          </Text>
          <DVSButton h={12} maxW="min" dvsType="secondary">
            Register to vote
          </DVSButton>
        </Stack>
      </Box>
      <DVSHeroIcon
        position={'absolute'}
        zIndex={-10}
        bottom={-10}
        right={{ base: 0, sm: -400 }}
        style={{ filter: 'blur(70px)' }}
      />
    </Container>
  );
};

export default DVSElectionContainer;
