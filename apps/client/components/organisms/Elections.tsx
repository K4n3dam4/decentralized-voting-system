import React from 'react';
import DVSSlider from '../molecules/DVSSlider';
import DVSElectionContainer from '../molecules/DVSElectionContainer';
import { ButtonProps } from '@chakra-ui/react';
import useModalStore from '../../store/ModalStore';

export interface ElectionsProps {
  elections: Election[];
}

const Elections: React.FC<ElectionsProps> = ({ elections }) => {
  const [setOpen] = useModalStore((s) => [s.setOpen]);

  const ElectionMap =
    elections &&
    elections.map((election) => {
      const buttonProps: ButtonProps[] = [
        {
          children: 'Register to vote',
          onClick: () => setOpen({ type: 'registerVoter', payload: election }),
        },
      ];
      return <DVSElectionContainer key={`election-${election.name}`} election={election} buttons={buttonProps} />;
    });

  return <DVSSlider>{ElectionMap}</DVSSlider>;
};

export default Elections;
