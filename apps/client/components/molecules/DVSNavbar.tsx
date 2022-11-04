import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorMode,
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import DVSButton from '../atoms/DVSButton';

export interface DVSNavbarProps {
  voter: Voter;
  admin: Admin;
  displayAuth: 'Register' | 'Login';
  onLogout: VoidFunction;
  onDisplayAuthChange: VoidFunction;
}

const DVSNavbar: React.FC<DVSNavbarProps> = ({ voter, admin, onLogout, displayAuth, onDisplayAuthChange }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [displayName] = useMediaQuery('(min-width: 600px)');

  const renderMenu = () =>
    voter || admin ? (
      <Menu>
        <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
          <Avatar size="sm" src="https://avatars.dicebear.com/api/male/username.svg" />
        </MenuButton>
        <MenuList alignItems="center">
          <br />
          <Center>
            <Avatar size="2xl" src="https://avatars.dicebear.com/api/male/username.svg" />
          </Center>
          <br />
          <Center>
            <p>{voter.email || admin.serviceNumber}</p>
          </Center>
          <br />
          <MenuDivider />
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    ) : (
      <Link href="/auth/login">
        <DVSButton onClick={onDisplayAuthChange} dvsType="primary">
          {displayAuth === 'Register' ? 'Login' : 'Register'}
        </DVSButton>
      </Link>
    );

  return (
    <>
      <Box position="fixed" width="100%" zIndex={1000} bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={5} alignItems="center">
            <Link href="/">Logo</Link>
            <Heading size="md">{displayName && 'Decentralized Voting System'}</Heading>
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
