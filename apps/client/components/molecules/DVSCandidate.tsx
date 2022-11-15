import React from 'react';
import { Box, Heading, Image } from '@chakra-ui/react';
import DVSCard, { DVSCardProps } from '../atoms/DVSCard';

export type DVSCandidateProps = DVSCardProps & Candidate;

const DVSCandidate: React.FC<DVSCandidateProps> = ({ image, party, name }) => {
  return (
    <DVSCard p={0}>
      <Image objectFit="cover" borderTopRadius={10} alt={name + ', ' + party} h={500} w="100%" src={image} />
      <Box px={5} py={8}>
        <Heading size="lg">{name}</Heading>
        <Heading mt={2} size="md">
          {party}
        </Heading>
      </Box>
    </DVSCard>
  );
};

export default DVSCandidate;
