import React from 'react';
import DVSSlider from '../molecules/DVSSlider';
import DVSElectionContainer from '../molecules/DVSElectionContainer';

export interface ElectionsProps {
  elections: any;
}

const Elections: React.FC<ElectionsProps> = ({ elections }) => {
  const ElectionMap = elections && elections.map((props) => <DVSElectionContainer {...props} />);

  return <DVSSlider>{ElectionMap}</DVSSlider>;
};

export default Elections;
