import React from 'react';
import { Avatar, Button, Center, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export interface DVSUserMenuProps {
  user: User;
  onLogout: VoidFunction;
}

const DVSUserMenu: React.FC<DVSUserMenuProps> = ({ user, onLogout }) => {
  const { role } = user;
  const { t } = useTranslation();

  return (
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
          <p>{user.email}</p>
        </Center>
        <br />
        <MenuDivider />
        {role === 'ADMIN' && (
          <Link href="/admin">
            <MenuItem>Admin</MenuItem>
          </Link>
        )}
        <MenuItem onClick={onLogout}>{t('auth.logout')}</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default DVSUserMenu;
