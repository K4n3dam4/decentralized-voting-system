import React from 'react';
import Countdown, { CountdownProps } from 'react-countdown';
import { Tag, TagLabel } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';

export interface DVSExpirationProps extends CountdownProps {
  value: string;
}

const DVSExpiration: React.FC<DVSExpirationProps> = ({ value, renderer, children, ...countdownProps }) => {
  const { t } = useTranslation();

  const rendererDefault = ({ days, hours, minutes, completed }) => {
    if (completed) {
      return (
        <Tag maxW="min" size="lg" colorScheme="red">
          <TagLabel>{t('expiration.closed')}</TagLabel>
        </Tag>
      );
    } else {
      return (
        <Tag maxW="max" size="lg" colorScheme="green">
          <TagLabel>{t('expiration.closesIn', { days, hours, minutes })}</TagLabel>
        </Tag>
      );
    }
  };

  return <Countdown renderer={rendererDefault} date={value} {...countdownProps} />;
};

export default DVSExpiration;
