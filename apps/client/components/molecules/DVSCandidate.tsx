import React from 'react';
import { Box, Heading, Image, useColorModeValue } from '@chakra-ui/react';
import DVSCard, { DVSCardProps } from '../atoms/DVSCard';
import { useTranslation } from 'next-i18next';

export interface DVSCandidateProps extends Omit<DVSCardProps, 'onClick'>, Candidate {
  onClick?: VoidFunction;
  winner?: boolean;
  draw?: boolean;
}

const DVSCandidate: React.FC<DVSCandidateProps> = ({ image, party, name, winner, draw, onClick }) => {
  const overLayColor = useColorModeValue('rgba(200, 200, 200, 0.6)', 'rgba(0, 0, 0, 0.6)');
  const winnerBGColor = useColorModeValue('#C6F7D4', '#2B3A3B');
  const winnerColor = useColorModeValue('#21543D', '#9BE6B4');
  const drawBGColor = useColorModeValue('#FEFCC0', '#3B3C34');
  const drawColor = useColorModeValue('#744110', '#F9F088');
  const { t } = useTranslation();

  return (
    <DVSCard
      _before={
        winner === false &&
        !draw && {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: overLayColor,
          borderRadius: 10,
          opacity: 1,
        }
      }
      position="relative"
      cursor={onClick ? 'pointer' : 'initial'}
      p={0}
      onClick={onClick}
    >
      <Box
        position="relative"
        _before={
          winner === false &&
          !draw && {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: overLayColor,
            borderTopRadius: 10,
            opacity: 1,
          }
        }
      >
        <Image objectFit="cover" borderTopRadius={10} alt={name + ', ' + party} h={500} w="100%" src={image} />
        {winner && !draw && (
          <Heading
            position="absolute"
            w="full"
            bottom={0}
            px={4}
            py={1}
            color={!draw ? winnerColor : drawColor}
            backgroundColor={!draw ? winnerBGColor : drawBGColor}
            size="lg"
          >
            {!draw ? t('election.winner') : t('election.draw')}
          </Heading>
        )}
      </Box>
      <Box px={4} py={4}>
        <Heading size="lg">{name}</Heading>
        <Heading mt={2} size="md">
          {party}
        </Heading>
      </Box>
    </DVSCard>
  );
};

export default DVSCandidate;
