import React from 'react';
import { Avatar, AvatarGroup, Flex, Stack, Text, useBreakpointValue } from '@chakra-ui/react';

interface DVSAvatar {
  name: string;
  url: string;
}

export interface DVSAvatarGroupProps {
  avatars: DVSAvatar[];
  user?: boolean;
}

const DVSAvatarGroup: React.FC<DVSAvatarGroupProps> = ({ avatars, user }) => {
  const breakPointsFlex = useBreakpointValue({ base: '44px', md: '60px' });

  return (
    <Stack direction={'row'} spacing={4} align={'center'}>
      <AvatarGroup>
        {avatars.map((avatar) => (
          <Avatar
            key={avatar.name}
            name={avatar.name}
            src={avatar.url}
            position={'relative'}
            zIndex={2}
            _before={{
              content: '""',
              width: 'full',
              height: 'full',
              rounded: 'full',
              transform: 'scale(1.125)',
              bgGradient: 'linear(to-bl, red.400,pink.400)',
              position: 'absolute',
              zIndex: -1,
              top: 0,
              left: 0,
            }}
          />
        ))}
      </AvatarGroup>
      {user && (
        <>
          <Text fontFamily="heading" fontSize={{ base: '4xl', md: '6xl' }}>
            +
          </Text>
          <Flex
            align="center"
            justify="center"
            fontFamily="heading"
            fontSize={{ base: 'sm', md: 'lg' }}
            bg="gray.800"
            color="white"
            rounded="full"
            minWidth={breakPointsFlex}
            minHeight={breakPointsFlex}
            position="relative"
            _before={{
              content: '""',
              width: 'full',
              height: 'full',
              rounded: 'full',
              transform: 'scale(1.125)',
              bgGradient: 'linear(to-bl, orange.400,yellow.400)',
              position: 'absolute',
              zIndex: -1,
              top: 0,
              left: 0,
            }}
          >
            YOU
          </Flex>{' '}
        </>
      )}
    </Stack>
  );
};

DVSAvatarGroup.defaultProps = {
  user: false,
};

export default DVSAvatarGroup;
