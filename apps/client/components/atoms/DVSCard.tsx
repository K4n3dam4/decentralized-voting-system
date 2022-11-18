import React from 'react';
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';

export type DVSCardProps = BoxProps;

const DVSCard: React.FC<DVSCardProps> = ({ children, ...restProps }) => {
  const bg = useColorModeValue('gray.100', 'gray.900');

  return (
    <Box borderRadius={10} px={5} py={8} bg={bg} {...restProps}>
      {children}
    </Box>
  );
};

export default DVSCard;
