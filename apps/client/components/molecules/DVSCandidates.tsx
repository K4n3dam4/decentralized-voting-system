import React from 'react';
import { IconButton, Button, Stack, Text } from '@chakra-ui/react';
import DVSFormInput, { DVSFormInputProps } from '../atoms/DVSFormInput';
import { Icon } from '@chakra-ui/icons';
import { AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai';
import { useTranslation } from 'next-i18next';
import DVSAlert from './DVSAlert';
import DVSColorPicker from '../atoms/DVSColorPicker';

export interface DVSCandidatesProps extends Omit<DVSFormInputProps, 'value' | 'onChange' | 'onFocus'> {
  name: string;
  value: Candidate[];
  onChange: (event: { target: { name: string; value: Candidate[] } }) => void;
  onFocus: (event: { target: { name: string } }) => void;
}

const DVSCandidates: React.FC<DVSCandidatesProps> = ({
  value: candidates,
  placeholder,
  onChange,
  onFocus,
  error,
  variant,
}) => {
  const { t } = useTranslation();

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newCandidates = JSON.parse(JSON.stringify(candidates));

    newCandidates[index][evt.target.name] = evt.target.value;

    onChange({ target: { name: 'candidates', value: newCandidates } });
  };
  const handeAddCandidate = () => {
    onFocus({ target: { name: 'candidates' } });
    onChange({
      target: { name: 'candidates', value: [...candidates, { name: '', party: '', image: '', partyColor: '#F38DBF' }] },
    });
  };
  const handleRemoveCandidate = (index) => {
    onFocus({ target: { name: 'candidates' } });

    const newCandidates = JSON.parse(JSON.stringify(candidates));

    newCandidates.splice(index, 1);

    onChange({ target: { name: 'candidates', value: newCandidates } });
  };

  const CandidateInput = candidates.map(({ name, party, image, partyColor }, index) => {
    return (
      <Stack key={`candidate-inputs-${index}`} alignItems="center" direction="row" spacing={5}>
        <Stack w="full" spacing={4}>
          <DVSFormInput
            placeholder={t('admin.common.candidate')}
            name="name"
            value={name}
            onChange={(event) => handleChange(event, index)}
            onFocus={() => onFocus({ target: { name: 'candidates' } })}
            variant={variant}
          />
          <Stack direction="row" spacing={4}>
            <DVSFormInput
              placeholder={t('admin.common.party')}
              name="party"
              value={party}
              onChange={(event) => handleChange(event, index)}
              onFocus={() => onFocus({ target: { name: 'candidates' } })}
              variant={variant}
            />
            <DVSColorPicker name="partyColor" color={partyColor} onChange={(event) => handleChange(event, index)}>
              Party color
            </DVSColorPicker>
          </Stack>
          <DVSFormInput
            placeholder={t('admin.common.image')}
            name="image"
            value={image}
            onChange={(event) => handleChange(event, index)}
            onFocus={() => onFocus({ target: { name: 'candidates' } })}
            variant={variant}
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
      {error && <DVSAlert variant="error">{error}</DVSAlert>}
      <Button
        alignSelf="flex-start"
        variant="outline"
        aria-label="add-candidate"
        colorScheme="green"
        leftIcon={<Icon as={AiFillPlusCircle} />}
        onClick={handeAddCandidate}
      >
        Add candidate
      </Button>
    </Stack>
  );
};

export default DVSCandidates;
