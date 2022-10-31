import { ChakraTheme, extendTheme } from '@chakra-ui/react';

const override: Partial<ChakraTheme> = {
  colors: {
    brand: {
      50: '#ffe4f7',
      100: '#fbb9dc',
      200: '#f38dbf',
      300: '#ec5fa0',
      400: '#e5337f',
      500: '#cc1a71',
      600: '#a01162',
      700: '#730a4d',
      800: '#470434',
      900: '#1e0016',
    },
  },
};

const customTheme = extendTheme(override);
export default customTheme;
