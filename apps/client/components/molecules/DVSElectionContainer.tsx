import React from 'react';
import {
  Box,
  ButtonProps,
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
import DVSExpiration from '../atoms/DVSExpiration';

export interface DVSElectionContainer extends ContainerProps {
  election: Election;
  buttons?: ButtonProps[];
}

const DVSElectionContainer: React.FC<DVSElectionContainer> = ({ election, buttons, ...containerProps }) => {
  return (
    <Container
      as={SimpleGrid}
      height="calc(100vh - 64px)"
      maxW="7xl"
      alignItems="center"
      columns={{ base: 1, md: 2 }}
      spacing={{ base: 4, md: 10, lg: 20 }}
      py={4}
      position="relative"
      {...containerProps}
    >
      <Box w={{ base: '100%' }}>
        <Image alt="election" src={election.image} />
      </Box>
      <Box display="flex" flex="1" flexDirection="column" justifyContent="center">
        <Heading lineHeight={1.3} mb={1}>
          <Link href={`${election.id}`}>{election.name}</Link>
        </Heading>
        <DVSExpiration value={election.expires} />
        <Stack spacing={5}>
          <Text as="p" marginTop={8} color={useColorModeValue('gray.700', 'gray.200')} fontSize="md">
            {election.description}
          </Text>
          {buttons &&
            buttons.map((props, index) => (
              <DVSButton key={`election-cont-btn-${index}`} h={10} maxW="min" dvsType="secondary" {...props} />
            ))}
        </Stack>
      </Box>
      <DVSHeroIcon
        position={'absolute'}
        display={{ base: 'none', md: 'block' }}
        zIndex={-10}
        bottom={-10}
        right={{ base: 0, sm: -400 }}
        style={{ filter: 'blur(70px)' }}
      />
    </Container>
  );
};

export default DVSElectionContainer;
