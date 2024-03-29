import React from 'react';
import Countdown, { CountdownProps } from 'react-countdown';
import { Box, BoxProps, Tag, TagLabel } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';

export interface DVSExpirationProps extends CountdownProps {
  value: string;
  tagSize?: string;
  boxProps?: BoxProps;
}

const DVSExpiration: React.FC<DVSExpirationProps> = ({
  value,
  renderer,
  children,
  tagSize = 'md',
  boxProps,
  ...countdownProps
}) => {
  const { t } = useTranslation();

  const rendererDefault = ({ days, hours, minutes, completed }) => {
    if (completed) {
      return (
        <Tag maxW="auto" size={tagSize} colorScheme="red">
          <TagLabel>{t('expiration.closed')}</TagLabel>
        </Tag>
      );
    } else {
      return (
        <Tag maxW="auto" size={tagSize} colorScheme="green">
          <TagLabel>{t('expiration.closesIn', { days, hours, minutes })}</TagLabel>
        </Tag>
      );
    }
  };

  return (
    <Box {...boxProps}>
      <Countdown renderer={rendererDefault} date={value} {...countdownProps} />
    </Box>
  );
};

export default DVSExpiration;
