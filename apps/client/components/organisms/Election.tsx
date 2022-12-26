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
import DVSElectionResults from '../molecules/DVSElectionResults';

export interface ElectionProps {
  election: Election;
}

const Election: React.FC<ElectionProps> = ({ election }) => {
  const { t } = useTranslation();
  const { showToast } = DVSToast();

  const setOpen = useModalStore((s) => s.setOpen);

  const electionInfo = useRef<HTMLDivElement>(null);
  const [refInViewport, ref] = useVisibility<HTMLDivElement>();
  const colSpanCandidate = useBreakpointValue({ base: 2, md: 1 });

  // handles scroll to candidates
  const handleScroll = () => {
    ref.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  };

  // handles register voter
  const handleRegister = () => setOpen({ type: 'registerVoter', payload: election });

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

  const PageContent = () => {
    let type: 'notRegistered' | 'registered' | 'hasVoted' | 'closed' = 'notRegistered';
    const closed = new Date(election.expires).getTime() < Date.now();

    if (election.registered) type = 'registered';
    if (election.hasVoted) type = 'hasVoted';
    if (closed) type = 'closed';

    switch (type) {
      case 'notRegistered':
      case 'registered': {
        return (
          <>
            <GridItem ref={electionInfo} colSpan={2}>
              <DVSHeroIcon
                position="absolute"
                display={{ base: 'none', md: 'block' }}
                zIndex={-10}
                left={200}
                style={{ filter: 'blur(70px)' }}
              />
              <DVSElectionInfoCard
                expiration={{ value: election.expires }}
                button={type === 'notRegistered' && { onClick: handleRegister, children: t('election.register') }}
                text={t(`election.${type}`)}
              />
            </GridItem>
            <GridItem colSpan={2} position="relative" display="flex" justifyContent="center">
              <DVSScrollTo
                onClick={handleScroll}
                inViewPort={refInViewport}
                icon={<ArrowDownIcon h={10} w={10} />}
                text={t('election.vote')}
              />
            </GridItem>
            {election.candidates.map((candidate, index) => (
              <GridItem ref={index < 1 ? ref : null} key={`candidate-${index}`} colSpan={colSpanCandidate}>
                <DVSCandidate {...candidate} onClick={() => handleVote(index, candidate)} />
              </GridItem>
            ))}
          </>
        );
      }
      case 'hasVoted':
      case 'closed': {
        return (
          <>
            <GridItem ref={electionInfo} colSpan={2}>
              <DVSHeroIcon
                position="absolute"
                display={{ base: 'none', md: 'block' }}
                zIndex={-10}
                left={200}
                style={{ filter: 'blur(70px)' }}
              />
              <DVSElectionInfoCard expiration={{ value: election.expires }} text={t(`election.${type}`)} />
            </GridItem>
            <GridItem colSpan={2} my={10}>
              <DVSElectionResults candidates={election.candidates} />
            </GridItem>
            {election.candidates.map((candidate, index) => (
              <GridItem ref={index < 1 ? ref : null} key={`candidate-${index}`} colSpan={colSpanCandidate}>
                <DVSCandidate {...candidate} winner={candidate?.winner} />
              </GridItem>
            ))}
          </>
        );
      }
    }
  };

  return (
    <Grid templateColumns={`repeat(2, 1fr)`} gap={5}>
      <GridItem colSpan={2}>
        <DVSElectionHeader name={election.name} description={election.description} image={election.image} />
      </GridItem>
      {PageContent()}
    </Grid>
  );
};

export default Election;
