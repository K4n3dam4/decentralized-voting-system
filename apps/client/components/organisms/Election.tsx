import React from 'react';
import { Grid, GridItem, Heading, useBreakpointValue } from '@chakra-ui/react';
import DVSCandidate from '../molecules/DVSCandidate';
import DVSElectionHeader from '../molecules/DVSElectionHeader';
import DVSCard from '../atoms/DVSCard';
import DVSButton from '../atoms/DVSButton';
import useModalStore from '../../store/ModalStore';
import { ArrowDownIcon } from '@chakra-ui/icons';
import useVisibility from '../../hooks/elements';

export interface ElectionProps {
  election: Election;
}

const Election: React.FC<ElectionProps> = ({ election }) => {
  const setOpen = useModalStore((s) => s.setOpen);
  const [refInViewport, ref] = useVisibility<HTMLDivElement>();

  const isEven = election.candidates.length % 2 === 0;
  const gridColumns = isEven ? 2 : 3;
  const colSpanCandidate = useBreakpointValue({ base: gridColumns, md: 1 });

  const handleScroll = () => {
    ref.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  };

  const CandidateMap = () =>
    election.candidates.map((candidate, index) => (
      <GridItem ref={index < 1 ? ref : null} key={`candidate-${index}`} colSpan={colSpanCandidate}>
        <DVSCandidate __css={{ cursor: 'pointer' }} {...candidate} />
      </GridItem>
    ));

  return (
    <Grid templateColumns={`repeat(${gridColumns}, 1fr)`} gap={5}>
      <GridItem colSpan={gridColumns}>
        <DVSElectionHeader name={election.name} description={election.description} image={election.image} />
      </GridItem>
      <GridItem colSpan={gridColumns}>
        <DVSCard h="100%" display="flex" justifyContent="center" alignItems="center">
          <DVSButton dvsType="secondary" onClick={() => setOpen({ type: 'registerVoter', payload: election })}>
            Register to vote
          </DVSButton>
        </DVSCard>
      </GridItem>
      <GridItem colSpan={gridColumns} display="flex" justifyContent="center">
        <DVSButton
          onClick={handleScroll}
          mt={150}
          mb={refInViewport ? 0 : 150}
          h={10}
          w={10}
          dvsType="secondary"
          variant="ghost"
          transition="500ms"
          opacity={refInViewport ? 0 : 1}
        >
          <ArrowDownIcon h={10} w={10} />
        </DVSButton>
      </GridItem>
      <GridItem colSpan={gridColumns}>
        <DVSCard display="flex" justifyContent="center">
          <Heading size="lg">Candidates</Heading>
        </DVSCard>
      </GridItem>
      {CandidateMap()}
    </Grid>
  );
};

export default Election;
