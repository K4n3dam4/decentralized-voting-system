import React from 'react';
import DVSCard, { DVSCardProps } from '../atoms/DVSCard';
import DVSFormInput, { DVSFormInputProps } from '../atoms/DVSFormInput';
import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import DVSCandidates, { DVSCandidatesProps } from './DVSCandidates';
import DVSFormTextarea, { DVSFormTextareaProps } from '../atoms/DVSFormTextarea';

type InputProps =
  | (DVSFormInputProps & { customType?: 'input' })
  | (DVSCandidatesProps & { customType: 'candidates' })
  | (DVSFormTextareaProps & { customType: 'textarea' });

export interface DVSAdminCreateProps extends DVSCardProps {
  inputs: InputProps[];
  heading?: string;
  description?: string;
}

const DVSAdminCreate: React.FC<DVSAdminCreateProps> = ({ inputs, heading = '', description, ...restProps }) => {
  const Inputs = inputs.map((input) => {
    if (input?.customType === 'candidates') return <DVSCandidates {...input} />;
    if (input?.customType === 'textarea') return <DVSFormTextarea {...input} />;
    return <DVSFormInput dvsVariant="formCard" {...input} />;
  });

  return (
    <DVSCard rounded="xl" p={{ base: 4, sm: 6, md: 8 }} {...restProps}>
      <Stack spacing={4}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
          {heading}
        </Heading>
        {description && <Text fontSize={{ base: 'sm', sm: 'md' }}>{description}</Text>}
      </Stack>
      <Box as="form" mt={8}>
        <Stack spacing={4}>{Inputs}</Stack>
      </Box>
    </DVSCard>
  );
};

export default DVSAdminCreate;
