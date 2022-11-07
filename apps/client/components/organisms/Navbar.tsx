import React from 'react';
import DVSNavbar from '../molecules/DVSNavbar';
import useUserStore from '../../store/UserStore';
import { useRouter } from 'next/router';
import useAuthStore from '../../store/AuthStore';

const Navbar = () => {
  const router = useRouter();
  const [user, logout] = useUserStore((s) => [s.user, s.logout]);
  const [displayAuth, setDisplayAuth] = useAuthStore((s) => [s.displayAuth, s.setDisplayAuth]);

  const handleLogout = () => logout(router);
  const handleDisplayAuth = () => setDisplayAuth();

  return (
    <DVSNavbar user={user} displayAuth={displayAuth} onLogout={handleLogout} onDisplayAuthChange={handleDisplayAuth} />
  );
};

export default Navbar;
