import { alertAnatomy } from '@chakra-ui/anatomy';
import styleFactory from '../chakra.utils';

const { definePartsStyle, defineMultiStyleConfig } = styleFactory(alertAnatomy.keys);

const success = ({ colorMode }) =>
  definePartsStyle({
    container: {
      bg: colorMode === 'dark' ? 'green.900' : 'green.500',
    },
  });

const error = ({ colorMode }) =>
  definePartsStyle({
    container: {
      bg: colorMode === 'dark' ? 'red.900' : 'red.500',
    },
  });

const warning = ({ colorMode }) =>
  definePartsStyle({
    container: {
      bg: colorMode === 'dark' ? 'yellow.900' : 'yellow.500',
    },
  });

const info = ({ colorMode }) =>
  definePartsStyle({
    container: {
      bg: colorMode === 'dark' ? 'blue.900' : 'blue.500',
    },
  });

const AlertStyle = defineMultiStyleConfig({
  baseStyle: () => ({
    icon: {
      color: 'white',
    },
    container: {
      borderRadius: 'md',
    },
    title: {
      color: 'white',
    },
    description: {
      color: 'white',
    },
  }),
  variants: { success, error, warning, info },
});

export default AlertStyle;
