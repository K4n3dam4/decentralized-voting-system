import React from 'react';
import { Box, ButtonProps, SimpleGrid, Text, TextProps } from '@chakra-ui/react';
import DVSExpiration, { DVSExpirationProps } from '../atoms/DVSExpiration';
import DVSButton from '../atoms/DVSButton';
import DVSCard from '../atoms/DVSCard';
import { useTranslation } from 'next-i18next';

export interface DVSElectionInfoCardProps {
  registered?: boolean;
  expiration?: DVSExpirationProps;
  button?: ButtonProps;
  text?: TextProps;
}

const DVSElectionInfoCard: React.FC<DVSElectionInfoCardProps> = ({ registered, expiration, button, text }) => {
  const { t } = useTranslation();

  return (
    <DVSCard>
      <SimpleGrid columns={registered ? 2 : 3} spacing={5}>
        <DVSExpiration
          boxProps={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', maxH: 30 }}
          tagSize="lg"
          {...expiration}
        />
        {!registered && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <DVSButton dvsType="secondary" {...button} />
          </Box>
        )}
        <Text {...text}>{registered ? t('election.registered') : t('election.notRegistered')}</Text>
      </SimpleGrid>
    </DVSCard>
  );
};

export default DVSElectionInfoCard;
