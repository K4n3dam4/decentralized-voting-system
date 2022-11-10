import React from 'react';
import { Box, Button, Flex, Heading, Stack, useColorMode, useColorModeValue, useMediaQuery } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import DVSLink, { DVSLinkProps } from '../atoms/DVSLink';

export interface DVSNavbarProps {
  links?: DVSLinkProps[];
  children: React.ReactNode | React.ReactNode[];
  title?: string;
}

const DVSNavbar: React.FC<DVSNavbarProps> = ({ links, children, title }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [displayName] = useMediaQuery('(min-width: 600px)');

  return (
    <>
      <Box position="fixed" width="100%" zIndex={1000} bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={8} alignItems="center">
            <Stack direction="row" spacing={5}>
              <Link href="/">Logo</Link>
              {title && <Heading size="md">{displayName && title}</Heading>}
            </Stack>
            <Stack direction="row" spacing={5}>
              {links &&
                links.map(({ children, ...restProps }) => (
                  <DVSLink key={`navbar-link-${children}`} variant="navbar" {...restProps}>
                    {children}
                  </DVSLink>
                ))}
            </Stack>
          </Stack>
          <Flex alignItems="center">
            <Stack direction="row" spacing={6}>
              <Button onClick={toggleColorMode}>{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}</Button>
              {children}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default DVSNavbar;
