import React from 'react';
import DVSNavbar from '../molecules/DVSNavbar';
import { useRouter } from 'next/router';
import useUserStore from '../../store/UserStore';
import useAuthStore from '../../store/AuthStore';
import DVSUserMenu from '../molecules/DVSUserMenu';
import DVSButton from '../atoms/DVSButton';
import { useTranslation } from 'next-i18next';
import { DVSLinkProps } from '../atoms/DVSLink';
import Routes from '../../config/routes';

const Navbar = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, logout] = useUserStore((s) => [s.user, s.logout]);
  const [displayAuth, setDisplayAuth] = useAuthStore((s) => [s.displayAuth, s.setDisplayAuth]);

  const handleLogout = () => logout(router);
  const handleDisplayAuth = () => setDisplayAuth();

  const renderMenu = () =>
    user ? (
      <DVSUserMenu user={user} onLogout={handleLogout} />
    ) : (
      <DVSButton onClick={handleDisplayAuth} dvsType="primary">
        {t(`auth.${displayAuth === 'register' ? 'login' : 'register'}`)}
      </DVSButton>
    );

  const links: DVSLinkProps[] = [
    {
      href: Routes.ElectionAll,
      children: t('elections.elections'),
    },
  ];

  return (
    <DVSNavbar title={t('title')} links={user && links}>
      {renderMenu()}
    </DVSNavbar>
  );
};

export default Navbar;
