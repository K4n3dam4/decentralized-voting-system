import React from 'react';
import DVSSlider from '../molecules/DVSSlider';
import DVSElectionContainer from '../molecules/DVSElectionContainer';

export interface ElectionsProps {
  elections: Election[];
}

const Elections: React.FC<ElectionsProps> = ({ elections }) => {
  const ElectionMap =
    elections &&
    elections.map((election) => {
      return <DVSElectionContainer key={`election-${election.name}`} election={election} />;
    });

  return <DVSSlider>{ElectionMap}</DVSSlider>;
};

export default Elections;
