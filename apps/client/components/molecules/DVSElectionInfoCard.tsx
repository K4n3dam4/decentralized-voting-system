import React from 'react';
import { Box, ButtonProps, SimpleGrid, Text } from '@chakra-ui/react';
import DVSExpiration, { DVSExpirationProps } from '../atoms/DVSExpiration';
import DVSButton from '../atoms/DVSButton';
import DVSCard from '../atoms/DVSCard';

export interface DVSElectionInfoCardProps {
  text: string;
  expiration?: DVSExpirationProps;
  button?: ButtonProps;
}

const DVSElectionInfoCard: React.FC<DVSElectionInfoCardProps> = ({ expiration, button, text }) => {
  return (
    <DVSCard>
      <SimpleGrid columns={!button ? 2 : 3} spacing={5}>
        <DVSExpiration
          boxProps={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', maxH: 30 }}
          tagSize="lg"
          {...expiration}
        />
        {button && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <DVSButton dvsType="secondary" {...button} />
          </Box>
        )}
        <Text>{text}</Text>
      </SimpleGrid>
    </DVSCard>
  );
};

export default DVSElectionInfoCard;
