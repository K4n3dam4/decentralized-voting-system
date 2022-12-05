import React from 'react';
import NextLink from 'next/link';
import { Box, Flex, Link, LinkProps } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export interface DVSMenuLinkProps extends LinkProps {
  icon?: JSX.Element;
  compact?: boolean;
}

const DVSMenuLink: React.FC<DVSMenuLinkProps> = ({ href, variant, icon, compact = false, children, ...restProps }) => {
  const { pathname } = useRouter();
  const active = pathname === `/${href}`;

  let vr = variant;

  if (variant === 'navbar') {
    if (active) vr = 'navbarActive';
  }

  return (
    <NextLink passHref href={`/${href}`}>
      <Link variant={vr} {...(restProps as Partial<LinkProps>)}>
        <Flex alignItems="center">
          <Box mr={!compact ? 2 : 0}>{icon && icon}</Box>
          {!compact && children}
        </Flex>
      </Link>
    </NextLink>
  );
};

export default DVSMenuLink;
