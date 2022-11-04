import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const styleFactory = (keys: string[] | readonly string[]) => {
  return createMultiStyleConfigHelpers(keys);
};

export default styleFactory;
