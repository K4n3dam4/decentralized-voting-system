import React from 'react';
import { FormControl, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';

export interface DVSFormInputProps extends InputProps {
  label?: string;
  error?: string;
}

const DVSFormInput: React.FC<DVSFormInputProps> = ({ label, error, ...props }) => {
  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel>{label}</FormLabel>}
      <Input
        placeholder="Use placeholder prop"
        bg="gray.100"
        border={0}
        color="gray.500"
        _placeholder={{
          color: 'gray.500',
        }}
        {...props}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default DVSFormInput;
