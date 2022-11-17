import React, { useRef } from 'react';
import { Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import DVSCandidate from '../molecules/DVSCandidate';
import DVSElectionHeader from '../molecules/DVSElectionHeader';
import useModalStore from '../../store/ModalStore';
import { ArrowDownIcon } from '@chakra-ui/icons';
import useVisibility from '../../hooks/elements';
import { useTranslation } from 'next-i18next';
import DVSElectionInfoCard from '../molecules/DVSElectionInfoCard';
import DVSScrollTo from '../atoms/DVSScrollTo';
import DVSHeroIcon from '../atoms/DVSHeroIcon';
import { DVSToast } from '../atoms/DVSToast';

export interface ElectionProps {
  election: Election;
}

const Election: React.FC<ElectionProps> = ({ election }) => {
  const { t } = useTranslation();
  const { showToast } = DVSToast();

  const setOpen = useModalStore((s) => s.setOpen);

  const electionInfo = useRef<HTMLDivElement>(null);
  const [refInViewport, ref] = useVisibility<HTMLDivElement>();
  const isEven = election.candidates.length % 2 === 0;
  const gridColumns = isEven ? 2 : 3;
  const colSpanCandidate = useBreakpointValue({ base: gridColumns, md: 1 });

  // handles scroll to candidates
  const handleScroll = () => {
    ref.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  };

  // handles vote
  const handleVote = (index: number, candidate: Candidate) => {
    if (election.registered) {
      // open vote modal
      setOpen({ type: 'vote', payload: { index, electionId: election.id, candidate } });
    } else {
      // scroll to register button
      electionInfo.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      showToast({ status: 'info', description: 'Please register as a voter.' });
    }
  };

  // candidate map
  const CandidateMap = () =>
    election.candidates.map((candidate, index) => (
      <GridItem ref={index < 1 ? ref : null} key={`candidate-${index}`} colSpan={colSpanCandidate}>
        <DVSCandidate {...candidate} onClick={() => handleVote(index, candidate)} />
      </GridItem>
    ));

  return (
    <Grid templateColumns={`repeat(${gridColumns}, 1fr)`} gap={5}>
      <GridItem colSpan={gridColumns}>
        <DVSElectionHeader name={election.name} description={election.description} image={election.image} />
      </GridItem>
      <GridItem ref={electionInfo} colSpan={gridColumns}>
        <DVSHeroIcon
          position="absolute"
          display={{ base: 'none', md: 'block' }}
          zIndex={-10}
          left={200}
          style={{ filter: 'blur(70px)' }}
        />
        <DVSElectionInfoCard
          registered={election.registered}
          expiration={{ value: election.expires }}
          button={{
            children: t('election.register'),
            onClick: () => setOpen({ type: 'registerVoter', payload: election }),
          }}
        />
      </GridItem>
      <GridItem colSpan={gridColumns} position="relative" display="flex" justifyContent="center">
        <DVSScrollTo
          onClick={handleScroll}
          inViewPort={refInViewport}
          icon={<ArrowDownIcon h={10} w={10} />}
          text={t('election.vote')}
        />
      </GridItem>
      {CandidateMap()}
    </Grid>
  );
};

export default Election;
