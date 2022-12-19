import { popoverAnatomy } from '@chakra-ui/anatomy';
import styleFactory from '../chakra.utils';

const { definePartsStyle, defineMultiStyleConfig } = styleFactory(popoverAnatomy.keys);

const candidates = ({ colorMode }) =>
  definePartsStyle({
    header: {
      fontFamily: 'Cabin',
      fontSize: 'xl',
    },
  });

const PopoverStyle = defineMultiStyleConfig({
  baseStyle: ({ colorMode }) => {
    const borderColor = colorMode === 'dark' ? 'gray.200' : 'gray.800';

    return definePartsStyle({
      header: {
        borderBottomColor: borderColor,
        borderBottomWidth: '0.5px',
      },
      content: {
        backgroundColor: colorMode === 'light' ? 'gray.200' : 'gray.800',
        borderWidth: '0.5px',
        borderColor,
      },
    });
  },
  variants: { candidates },
});

export default PopoverStyle;
