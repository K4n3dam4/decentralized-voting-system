import React from 'react';
import { Alert, AlertDescription, AlertIcon, AlertProps } from '@chakra-ui/react';

export interface DVSAlertProps extends AlertProps {
  customIcon?: React.ReactNode;
}

const DVSAlert: React.FC<DVSAlertProps> = ({ customIcon, children, ...alertProps }) => {
  return (
    <Alert variant="subtle" {...alertProps}>
      {customIcon || <AlertIcon />}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};

export default DVSAlert;
