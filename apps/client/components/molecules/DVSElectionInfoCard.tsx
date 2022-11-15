import React from 'react';
import { Box, ButtonProps, SimpleGrid, Text, TextProps } from '@chakra-ui/react';
import DVSExpiration, { DVSExpirationProps } from '../atoms/DVSExpiration';
import DVSButton from '../atoms/DVSButton';
import DVSCard from '../atoms/DVSCard';

export interface DVSElectionInfoCardProps {
  expiration?: DVSExpirationProps;
  button?: ButtonProps;
  text?: TextProps;
}

const DVSElectionInfoCard: React.FC<DVSElectionInfoCardProps> = ({ expiration, button, text }) => {
  return (
    <DVSCard>
      <SimpleGrid columns={3} spacing={5}>
        <DVSExpiration
          boxProps={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', maxH: 30 }}
          tagSize="lg"
          {...expiration}
        />
        <Box display="flex" justifyContent="center" alignItems="center">
          <DVSButton dvsType="secondary" {...button} />
        </Box>
        <Text {...text} />
      </SimpleGrid>
    </DVSCard>
  );
};

export default DVSElectionInfoCard;
