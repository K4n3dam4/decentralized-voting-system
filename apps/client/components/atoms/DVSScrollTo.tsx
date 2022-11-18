import React from 'react';
import { ButtonProps, Stack, Text } from '@chakra-ui/react';
import DVSButton from './DVSButton';

export interface DVSScrollToProps extends ButtonProps {
  inViewPort: boolean;
  icon: JSX.Element;
  text?: string;
}

const DVSScrollTo: React.FC<DVSScrollToProps> = ({ inViewPort, icon, text, ...restProps }) => {
  return (
    <DVSButton
      mt={inViewPort ? 0 : 120}
      mb={inViewPort ? 0 : 200}
      h={20}
      w={20}
      dvsType="secondary"
      _hover={{ bg: 'none' }}
      _active={{ bg: 'none' }}
      variant="ghost"
      transition="500ms"
      opacity={inViewPort ? 0 : 1}
      {...restProps}
    >
      <Stack>
        {text && <Text>{text}</Text>}
        {icon}
      </Stack>
    </DVSButton>
  );
};

export default DVSScrollTo;
