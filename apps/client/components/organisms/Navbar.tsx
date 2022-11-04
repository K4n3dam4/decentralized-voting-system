import React from 'react';
import DVSNavbar from '../molecules/DVSNavbar';
import useUserStore from '../../store/UserStore';
import { useRouter } from 'next/router';
import useAuthStore from '../../store/AuthStore';

const Navbar = () => {
  const router = useRouter();
  const [voter, admin, logout] = useUserStore((s) => [s.voter, s.admin, s.logout]);
  const [displayAuth, setDisplayAuth] = useAuthStore((s) => [s.displayAuth, s.setDisplayAuth]);

  const handleLogout = () => logout(router);
  const handleDisplayAuth = () => setDisplayAuth();

  return (
    <DVSNavbar
      admin={admin}
      voter={voter}
      displayAuth={displayAuth}
      onLogout={handleLogout}
      onDisplayAuthChange={handleDisplayAuth}
    />
  );
};

export default Navbar;
