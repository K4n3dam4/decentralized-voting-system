import React from 'react';
import { IconButton, Stack, Text } from '@chakra-ui/react';
import DVSFormInput, { DVSFormInputProps } from '../atoms/DVSFormInput';
import { Icon } from '@chakra-ui/icons';
import { AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai';
import { useTranslation } from 'next-i18next';

export interface DVSCandidatesProps extends Omit<DVSFormInputProps, 'value' | 'onChange'> {
  name: string;
  value: Candidate[];
  onChange: (event: { target: { name: string; value: Candidate[] } }) => void;
}

const DVSCandidates: React.FC<DVSCandidatesProps> = ({ value: candidates, placeholder, onChange }) => {
  const { t } = useTranslation();

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newCandidates = JSON.parse(JSON.stringify(candidates));

    newCandidates[index][evt.target.name] = evt.target.value;

    onChange({ target: { name: 'candidates', value: newCandidates } });
  };
  const handeAddCandidate = () => {
    onChange({ target: { name: 'candidates', value: [...candidates, { name: '', party: '', image: '' }] } });
  };
  const handleRemoveCandidate = (index) => {
    const newCandidates = JSON.parse(JSON.stringify(candidates));

    newCandidates.splice(index, 1);

    onChange({ target: { name: 'candidates', value: newCandidates } });
  };

  const CandidateInput = candidates.map(({ name, party, image }, index) => {
    return (
      <Stack key={`candidate-inputs-${index}`} alignItems="center" direction="row" spacing={5}>
        <Stack w="full" spacing={4}>
          <DVSFormInput
            placeholder={t('admin.common.candidate')}
            name="name"
            value={name}
            onChange={(event) => handleChange(event, index)}
          />
          <DVSFormInput
            placeholder={t('admin.common.party')}
            name="party"
            value={party}
            onChange={(event) => handleChange(event, index)}
          />
          <DVSFormInput
            placeholder={t('admin.common.image')}
            name="image"
            value={image}
            onChange={(event) => handleChange(event, index)}
          />
        </Stack>
        <IconButton
          w={10}
          variant="ghost"
          aria-label="add-candidate"
          colorScheme="red"
          icon={<Icon as={AiFillMinusCircle} />}
          onClick={() => handleRemoveCandidate(index)}
        />
      </Stack>
    );
  });

  return (
    <Stack position="relative" spacing={6} pt={6}>
      {placeholder && <Text>{placeholder}</Text>}
      {CandidateInput}
      <IconButton
        w={10}
        alignSelf="flex-start"
        variant="ghost"
        aria-label="add-candidate"
        colorScheme="green"
        icon={<Icon as={AiFillPlusCircle} />}
        onClick={handeAddCandidate}
      />
    </Stack>
  );
};

export default DVSCandidates;
