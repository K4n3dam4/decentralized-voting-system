import React from 'react';
import {
  Box,
  BoxProps,
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
  useColorModeValue,
} from '@chakra-ui/react';
import DVSCard, { DVSCardProps } from '../atoms/DVSCard';
import { config } from '../../config/config';
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
          {candidates.map((candidate, index) => (
            <GridItem key={`admin-data-candidates-item-${index}`} height="auto" colSpan={1}>
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

export interface DVSAdminDataDisplayActionsProps extends DVSCardProps {
  show: boolean;
}

const Actions: React.FC<DVSAdminDataDisplayActionsProps> = ({ show, children, ...restProps }) => {
  return (
    <DVSCard
      h="80px"
      w="full"
      transition="500ms ease"
      position="absolute"
      overflowY="hidden"
      bottom={!show ? '-100px' : 0}
      right={0}
      borderTopRadius={0}
      bg={useColorModeValue('rgba(237, 242, 246, 0.95)', 'rgba(23, 25, 35, 0.8)')}
      backdropFilter="blur(5px)"
      p={5}
      {...restProps}
    >
      {children}
    </DVSCard>
  );
};

export interface DVSAdminDataDisplayProps extends BoxProps {
  card?: DVSCardProps;
  headerImage?: React.ReactNode;
  buttons?: DVSButtonProps[];
  actions?: React.ReactNode;
}

const DVSAdminDataDisplay = ({
  headerImage,
  children,
  buttons,
  card,
  actions,
  ...boxProps
}: DVSAdminDataDisplayProps) => {
  const WrappedContent = () => {
    const content = (
      <DVSCard display="flex" flexDirection="column" justifyContent="space-between" px={0} pt={0} pb={5} {...card}>
        <Box>
          {headerImage}
          <Stack px={5} pt={5} spacing={5}>
            {children}
          </Stack>
        </Box>
        {buttons && (
          <Stack px={5} pt={5} direction="row" justifyContent="flex-end" spacing={2}>
            {buttons.map((button, index) => (
              <DVSButton key={`admin-data-prop-btn-${index}`} size="md" {...button} />
            ))}
          </Stack>
        )}
      </DVSCard>
    );
    if (Object.keys(boxProps).length > 0)
      return (
        <Box position="relative" overflow="hidden" h={{ base: 'auto', lg: '620px' }} {...boxProps}>
          {content}
          {actions && actions}
        </Box>
      );
    return content;
  };

  return WrappedContent();
};

DVSAdminDataDisplay.HeaderImage = HeaderImage;
DVSAdminDataDisplay.Data = Data;
DVSAdminDataDisplay.Actions = Actions;
DVSAdminDataDisplay.Canidate = Candidate;
DVSAdminDataDisplay.Candidates = Candidates;

export default DVSAdminDataDisplay;
