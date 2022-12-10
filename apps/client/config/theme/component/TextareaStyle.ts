import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

const lighter = ({ colorMode }) =>
  defineStyle({
    px: '0',
    borderBottom: '1px solid',
    borderRadius: 0,
    borderColor: colorMode === 'dark' ? 'gray.400' : 'gray.500',
    color: colorMode === 'dark' ? 'gray.400' : 'gray.500',
    _placeholder: {
      color: colorMode === 'dark' ? 'gray.400' : 'gray.500',
    },
  });

const TextareaStyle = defineStyleConfig({
  baseStyle: ({ colorMode }) =>
    defineStyle({
      bg: 'transparent',
      transition: '100ms',
      transitionDuration: 'normal',
      transitionProperty: 'common',
      minHeight: '100px',
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
    }),
  variants: { lighter },
  defaultProps: {
    variant: 'lighter',
  },
});

export default TextareaStyle;
