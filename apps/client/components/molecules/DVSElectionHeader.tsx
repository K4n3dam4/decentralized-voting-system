import React from 'react';
import { Stack, Text, useColorModeValue, Box, Heading, useMediaQuery } from '@chakra-ui/react';
import DVSCard, { DVSCardProps } from '../atoms/DVSCard';

export interface DVSElectionHeaderProps extends DVSCardProps {
  name: string;
  description?: string;
  image?: string;
}

const DVSElectionHeader: React.FC<DVSElectionHeaderProps> = ({ name, description, image, ...restProps }) => {
  const [showBg] = useMediaQuery('(max-width: 767px)');
  const bg = useColorModeValue('gray.100', 'gray.900');
  const overlayColorMd = useColorModeValue(
    'linear(to-r, rgba(248, 250, 252, 1) 47%, rgba(160, 21, 101, 0.34) 100%)',
    'linear(to-r, rgba(23, 25, 35, 1) 47%, rgba(243, 141, 191, 0.34) 100%)',
  );

  return (
    <DVSCard position="relative" bgImage={image} backgroundSize="cover" {...restProps}>
      <Stack w={{ base: '100%', md: 'lg' }} height="100%">
        <Heading zIndex={10} size="lg">
          {name}
        </Heading>
        <Text zIndex={10}>{description}</Text>
      </Stack>
      <Box
        borderRadius={10}
        left={0}
        top={0}
        position="absolute"
        w="100%"
        h="100%"
        bgGradient={overlayColorMd}
        bg={showBg && bg}
        zIndex={0}
      />
    </DVSCard>
  );
};

export default DVSElectionHeader;
