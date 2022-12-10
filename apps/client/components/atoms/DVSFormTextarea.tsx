import React from 'react';
import { FormControl, FormErrorMessage, FormLabel, Textarea, TextareaProps } from '@chakra-ui/react';

export interface DVSFormTextareaProps extends TextareaProps {
  label?: string;
  error?: string;
}

const DVSFormTextarea: React.FC<DVSFormTextareaProps> = ({ label, error, variant, ...props }) => {
  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel>{label}</FormLabel>}
      <Textarea isInvalid={!!error} placeholder="Use placeholder prop" variant={variant} {...props} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default DVSFormTextarea;
