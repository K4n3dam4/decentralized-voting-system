import React, { FunctionComponent } from 'react';
import { Alert, AlertDescription, AlertIcon, AlertProps, CloseButton } from '@chakra-ui/react';

export interface DVSAlertProps extends AlertProps {
  customIcon?: FunctionComponent;
  onClose?: VoidFunction;
}

const DVSAlert: React.FC<DVSAlertProps> = ({ customIcon, children, status, onClose, ...alertProps }) => {
  return (
    <Alert position="relative" status={status} variant={status} {...alertProps}>
      <AlertIcon />
      <AlertDescription>{children}</AlertDescription>
      {onClose && (
        <CloseButton
          color="white"
          position="absolute"
          right={2}
          top="50%"
          transform="translateY(-50%)"
          onClick={onClose}
        />
      )}
    </Alert>
  );
};

export default DVSAlert;
