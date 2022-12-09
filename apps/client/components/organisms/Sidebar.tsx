import React from 'react';
import DVSSidebar, { DVSSidebarProps } from '../molecules/DVSSidebar';
import { useRouter } from 'next/router';
import { DVSMenuLinkProps } from '../atoms/DVSMenuLink';
import { GiPapers } from 'react-icons/gi';
import { FaUsers } from 'react-icons/fa';
import { IoMdCreate, IoIosAnalytics } from 'react-icons/io';
import { Icon } from '@chakra-ui/icons';

const Sidebar = () => {
  const router = useRouter();

  const sidebarProps = () => {
    const { asPath } = router;
    let menuLinks: DVSMenuLinkProps[];
    let dividers: DVSSidebarProps['dividers'];

    switch (asPath) {
      case '/admin':
        menuLinks = [
          {
            href: 'admin/',
            children: 'Overview',
            icon: <Icon as={IoIosAnalytics} />,
          },
          {
            href: 'admin/election/overview',
            children: 'List',
            icon: <Icon as={GiPapers} />,
          },
          {
            href: 'admin/election/create',
            children: 'Create',
            icon: <Icon as={IoMdCreate} />,
          },
          {
            href: 'admin/users/overview',
            children: 'List',
            icon: <Icon as={FaUsers} />,
          },
          {
            href: 'admin/users/create',
            children: 'Create',
            icon: <Icon as={IoMdCreate} />,
          },
        ];
        dividers = [
          {
            name: 'Elections',
            index: 1,
          },
          {
            name: 'Users',
            index: 3,
          },
        ];
        break;
      case '/admin/election/create':
        menuLinks = [
          {
            href: 'admin/',
            children: 'Overview',
            icon: <Icon as={IoIosAnalytics} />,
          },
          {
            href: 'admin/election/overview',
            children: 'List',
            icon: <Icon as={GiPapers} />,
          },
          {
            href: 'admin/election/create',
            children: 'Create',
            icon: <Icon as={IoMdCreate} />,
          },
          {
            href: 'admin/users/overview',
            children: 'List',
            icon: <Icon as={FaUsers} />,
          },
          {
            href: 'admin/users/create',
            children: 'Create',
            icon: <Icon as={IoMdCreate} />,
          },
        ];
        dividers = [
          {
            name: 'Elections',
            index: 1,
          },
          {
            name: 'Users',
            index: 3,
          },
        ];
    }

    return { menuLinks, dividers };
  };

  return sidebarProps().menuLinks && <DVSSidebar {...sidebarProps()} />;
};

export default Sidebar;
