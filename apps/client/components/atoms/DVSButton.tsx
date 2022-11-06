import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

export interface DVSButtonProps extends ButtonProps {
  dvsType: buttonType;
}

const DVSButton: React.FC<DVSButtonProps> = ({ children, dvsType, ...restProps }) => {
  return (
    <Button colorScheme="brand" variant={dvsType === 'primary' ? 'solid' : 'outline'} {...restProps}>
      {children}
    </Button>
  );
};

export default DVSButton;
