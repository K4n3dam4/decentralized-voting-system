import { ChakraTheme, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

import { InputStyle } from './component';

export type DVSVariant = 'formCard';

const override: Partial<ChakraTheme> = {
  config: {
    initialColorMode: 'dark',
  },
  fonts: {
    heading: 'Cabin',
  },
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
  styles: {
    global: (props) => ({
      body: {
        bg: mode('gray.200', 'gray.800')(props),
      },
    }),
  },
  components: {
    Input: InputStyle,
  },
};

const chakraTheme = extendTheme(override);
export default chakraTheme;
