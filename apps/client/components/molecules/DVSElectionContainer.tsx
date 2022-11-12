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
  name: string;
}

const DVSElectionContainer: React.FC<DVSElectionContainer> = ({ name, ...containerProps }) => {
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
        <Image
          alt="election"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Flag_of_Indiana.svg/2560px-Flag_of_Indiana.svg.png"
        />
      </Box>
      <Box display="flex" flex="1" flexDirection="column" justifyContent="center">
        <Heading lineHeight={1.3}>
          <Link href="/">{name}</Link>
        </Heading>
        <Stack spacing={5}>
          <Text as="p" marginTop={10} color={useColorModeValue('gray.700', 'gray.200')} fontSize="lg">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
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
