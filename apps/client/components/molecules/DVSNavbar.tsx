import React from 'react';
import { Box, Button, Flex, Heading, Stack, useColorMode, useColorModeValue, useMediaQuery } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import DVSButton from '../atoms/DVSButton';
import { useTranslation } from 'next-i18next';
import DVSUserMenu from './DVSUserMenu';
import DVSLink from '../atoms/DVSLink';
import Routes from '../../config/routes';

export interface DVSNavbarProps {
  user: User;
  displayAuth: 'register' | 'login';
  onLogout: VoidFunction;
  onDisplayAuthChange: VoidFunction;
}

const DVSNavbar: React.FC<DVSNavbarProps> = ({ user, onLogout, displayAuth, onDisplayAuthChange }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [displayName] = useMediaQuery('(min-width: 600px)');
  const { t } = useTranslation();

  const renderMenu = () =>
    user ? (
      <DVSUserMenu user={user} onLogout={onLogout} />
    ) : (
      <DVSButton onClick={onDisplayAuthChange} dvsType="primary">
        {t(`auth.${displayAuth === 'register' ? 'login' : 'register'}`)}
      </DVSButton>
    );

  return (
    <>
      <Box position="fixed" width="100%" zIndex={1000} bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={8} alignItems="center">
            <Stack direction="row" spacing={5}>
              <Link href="/">Logo</Link>
              <Heading size="md">{displayName && 'Decentralized Voting System'}</Heading>
            </Stack>
            <Stack direction="row" spacing={5}>
              <DVSLink variant="navbar" href={Routes.ElectionAll}>
                {t('elections.elections')}
              </DVSLink>
            </Stack>
          </Stack>
          <Flex alignItems="center">
            <Stack direction="row" spacing={6}>
              <Button onClick={toggleColorMode}>{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}</Button>
              {renderMenu()}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default DVSNavbar;
