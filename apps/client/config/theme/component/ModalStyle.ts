import { modalAnatomy } from '@chakra-ui/anatomy';
import styleFactory from '../chakra.utils';

const { defineMultiStyleConfig } = styleFactory(modalAnatomy.keys);

const ModalStyle = defineMultiStyleConfig({
  baseStyle: ({ colorMode }) => ({
    header: {
      fontSize: 26,
      paddingBottom: '0px',
    },
    dialogContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    dialog: {
      minW: { md: 'lg' },
      bg: colorMode === 'dark' ? 'gray.800' : 'gray.200',
    },
    body: {
      paddingTop: '16px',
      paddingBottom: '16px',
      '& p': {
        fontSize: 15,
      },
      '& input': {
        marginTop: '16px',
      },
    },
  }),
});

export default ModalStyle;
