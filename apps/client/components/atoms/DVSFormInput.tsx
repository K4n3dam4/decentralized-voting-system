import React from 'react';
import { FormControl, FormErrorMessage, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { DVSVariant } from '../../config/theme/chakra.theme';

export interface DVSFormInputProps extends InputProps {
  label?: string;
  error?: string;
  dvsVariant?: DVSVariant;
}

const DVSFormInput: React.FC<DVSFormInputProps> = ({ label, error, dvsVariant, ...props }) => {
  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel>{label}</FormLabel>}
      <Input placeholder="Use placeholder prop" variant="formCard" {...props} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

DVSFormInput.defaultProps = {
  dvsVariant: 'formCard',
};

export default DVSFormInput;
