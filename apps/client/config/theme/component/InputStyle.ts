import { inputAnatomy } from '@chakra-ui/anatomy';
import styleFactory from '../chakra.utils';

const { definePartsStyle, defineMultiStyleConfig } = styleFactory(inputAnatomy.keys);

const formCard = () =>
  definePartsStyle({
    field: {
      px: '0',
      color: 'gray.500',
      _placeholder: {
        color: 'gray.500',
      },
    },
  });

const lighter = ({ colorMode }) =>
  definePartsStyle({
    field: {
      px: '0',
      borderColor: colorMode === 'dark' ? 'gray.400' : 'gray.500',
      color: colorMode === 'dark' ? 'gray.400' : 'gray.500',
      _placeholder: {
        color: colorMode === 'dark' ? 'gray.400' : 'gray.500',
      },
    },
  });

const InputStyle = defineMultiStyleConfig({
  baseStyle: ({ colorMode }) => ({
    field: {
      border: 5,
      borderRadius: 0,
      borderBottom: '1px solid',
      appearance: 'none',
      bg: 'transparent',
      transition: '100ms',
      transitionDuration: 'normal',
      transitionProperty: 'common',
      rounded: 0,
      outline: 0,
      _focusVisible: {
        borderColor: colorMode === 'dark' ? 'brand.200' : 'brand.600',
        _placeholder: {
          color: colorMode === 'dark' ? 'brand.200' : 'brand.600',
        },
      },
      _disabled: {
        cursor: 'not-allowed',
        opacity: 0.4,
      },
      _invalid: {
        borderColor: colorMode === 'dark' ? 'red.300' : 'red.500',
      },
    },
  }),
  variants: { formCard, lighter },
});

export default InputStyle;
