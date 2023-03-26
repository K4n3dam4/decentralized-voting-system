import React from 'react';
import { Stack, StackProps, Text, useColorMode } from '@chakra-ui/react';

export type DVSLoadingSpinnerProps = StackProps;

const DVSLoadingSpinner = ({ children, ...restProps }: StackProps) => {
  const { colorMode } = useColorMode();

  return (
    <Stack
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      spacing={5}
      py={5}
      {...restProps}
    >
      <div className={`lds-roller ${colorMode}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {children && <Text>{children}</Text>}
    </Stack>
  );
};

export default DVSLoadingSpinner;
