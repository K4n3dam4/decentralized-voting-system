import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const navbar = defineStyle({
  fontSize: 'lg',
  fontWeight: 500,
  position: 'relative',
  transition: '200ms',
  _hover: {
    textDecoration: 'none',
  },
});

const navbarActive = ({ colorMode }) =>
  defineStyle({
    fontSize: 'lg',
    fontWeight: 500,
    position: 'relative',
    _after: {
      position: 'absolute',
      content: '""',
      height: '2px',
      bottom: '0px',
      margin: '0 auto',
      left: '0',
      right: '0',
      background: colorMode === 'dark' ? 'brand.200' : 'brand.600',
      width: '100%',
    },
    _hover: {
      textDecoration: 'none',
    },
  });

const LinkStyle = defineStyleConfig({
  baseStyle: ({ colorMode }) => ({
    color: colorMode === 'dark' ? 'brand.200' : 'brand.600',
  }),
  variants: { navbar, navbarActive },
});

export default LinkStyle;
