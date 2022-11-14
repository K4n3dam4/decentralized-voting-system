import { Text, useToast, UseToastOptions } from '@chakra-ui/react';
import React from 'react';
import DVSAlert from '../molecules/DVSAlert';
import { WarningIcon, CheckIcon, InfoIcon } from '@chakra-ui/icons';

export interface DVSToastOptions {
  status: UseToastOptions['status'];
  description: string;
  options?: UseToastOptions;
}

export const DVSToast = () => {
  const toast = useToast();
  const Icon = {
    success: CheckIcon,
    error: WarningIcon,
    warning: WarningIcon,
    info: InfoIcon,
  };

  const showToast = ({ status, description, options }: DVSToastOptions) => {
    toast({
      isClosable: true,
      duration: 5000,
      position: 'top',
      description: <Text>{description}</Text>,
      render: (props) => (
        <DVSAlert status={status} customIcon={Icon[status]} onClose={props.onClose}>
          {description}
        </DVSAlert>
      ),
      ...options,
    });
  };

  return { showToast };
};
