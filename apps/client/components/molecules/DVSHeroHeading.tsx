import React from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

export interface DVSHeroHeading {
  heading1: string;
  heading2?: string;
  emphasize?: string;
  children?: React.ReactNode;
}

const DVSHeroHeading: React.FC<DVSHeroHeading> = ({ heading1, heading2, emphasize, children }) => {
  const headings: string[] = [];

  if (emphasize) {
    const words = heading1.split(' ');
    const emphasizedWordIndex = words.indexOf(emphasize);

    if (emphasizedWordIndex < 0) {
      console.error('Word supplied to emphasize property does not exist in heading1 property');
    }
    words.splice(emphasizedWordIndex, 1);
    headings.push(words.slice(0, emphasizedWordIndex).join(' '));
    headings.push(emphasize);
    headings.push(words.slice(emphasizedWordIndex, words.length).join(' '));
  }

  return (
    <Stack spacing={{ base: 10, md: 20 }}>
      {headings.length < 3 ? (
        <Heading lineHeight={1.3} fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
          {heading1}
        </Heading>
      ) : (
        <Heading lineHeight={1.3} fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
          {headings[0]}{' '}
          <Text as="span" bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
            {headings[1]}{' '}
          </Text>
          {headings[2]}
        </Heading>
      )}
      {heading2 && (
        <Heading
          mt={[0, '2rem !important']}
          lineHeight={1.3}
          fontSize={{ base: '1xl', sm: '2xl', md: '3xl', lg: '4xl' }}
        >
          {heading2}
        </Heading>
      )}
      {children && children}
    </Stack>
  );
};
export default DVSHeroHeading;
