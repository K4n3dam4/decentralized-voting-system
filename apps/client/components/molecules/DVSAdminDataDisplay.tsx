import React from 'react';
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Image,
  ImageProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  TextProps,
} from '@chakra-ui/react';
import DVSCard, { DVSCardProps } from '../atoms/DVSCard';
import { config } from 'apps/client/config/config';
import DVSButton, { DVSButtonProps } from '../atoms/DVSButton';

const HeaderImage: React.FC<ImageProps> = (props) => (
  <Image borderTopRadius={10} w="full" objectFit="cover" {...props} />
);
export interface DVSAdminDataDisplayDataProps extends Omit<TextProps, 'children'> {
  children: string | string[];
}

const Data: React.FC<DVSAdminDataDisplayDataProps> = ({ children, ...props }) => (
  <Box>
    {typeof children !== 'string' && (
      <Heading size="md" mb={2}>
        {children[0]}
      </Heading>
    )}
    <Text fontSize="md" {...props}>
      {typeof children !== 'string' ? children[1] : children}
    </Text>
  </Box>
);

const Candidate: React.FC<Candidate> = ({ image, name, party }) => (
  <Popover variant="candidates">
    <PopoverTrigger>
      <Button disabled={!name || !party || !image} variant="unstyled" height="auto">
        <Image borderRadius={5} w="full" objectFit="cover" src={image} fallbackSrc={config.get('imageFallback')} />
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      {name && <PopoverHeader>{name}</PopoverHeader>}
      {party && <PopoverBody>{party}</PopoverBody>}
    </PopoverContent>
  </Popover>
);
const Candidates: React.FC<{ candidates: Candidate[]; placeholder?: React.ReactNode }> = ({
  candidates,
  placeholder,
}) => {
  return (
    <Box>
      {candidates.length > 0 ? (
        <Grid h="auto" templateColumns={`repeat(${candidates.length > 2 ? '3' : '2'}, 1fr)`} gap={5}>
          {candidates.map((candidate) => (
            <GridItem height="auto" colSpan={1}>
              <Candidate {...candidate} />
            </GridItem>
          ))}
        </Grid>
      ) : (
        placeholder
      )}
    </Box>
  );
};

export interface DVSAdminDataDisplayProps extends DVSCardProps {
  headerImage?: React.ReactNode;
  buttons?: DVSButtonProps[];
}

const DVSAdminDataDisplay = ({ headerImage, children, buttons, ...cardProps }: DVSAdminDataDisplayProps) => {
  return (
    <DVSCard display="flex" flexDirection="column" justifyContent="space-between" px={0} pt={0} pb={5} {...cardProps}>
      <Box>
        {headerImage}
        <Stack px={5} pt={5} spacing={5}>
          {children}
        </Stack>
      </Box>
      {buttons && (
        <Stack px={5} pt={5} direction="row" justifyContent="flex-end" spacing={2}>
          {buttons.map((button) => (
            <DVSButton size="md" {...button} />
          ))}
        </Stack>
      )}
    </DVSCard>
  );
};

DVSAdminDataDisplay.HeaderImage = HeaderImage;
DVSAdminDataDisplay.Data = Data;
DVSAdminDataDisplay.Canidate = Candidate;
DVSAdminDataDisplay.Candidates = Candidates;

export default DVSAdminDataDisplay;
