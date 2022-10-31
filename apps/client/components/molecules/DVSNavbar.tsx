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
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import DVSButton from '../atoms/DVSButton';

const DVSNavbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Box position="absolute" width="100%" zIndex={1000} bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={5} alignItems="center">
            <Link href="/">Logo</Link>
            <Heading size="md">Decentralized Voting System</Heading>
          </Stack>
          <Flex alignItems="center">
            <Stack direction="row" spacing={6}>
              <Button onClick={toggleColorMode}>{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}</Button>
              <Link href="/auth/login">
                <DVSButton dvsType="primary">Login</DVSButton>
              </Link>

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
                    <p>Username</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem>Your Servers</MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default DVSNavbar;
