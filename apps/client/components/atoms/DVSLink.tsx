import NextLink from 'next/link';
import React from 'react';
import { Button, ButtonProps, Link, LinkProps } from '@chakra-ui/react';
import { useRouter } from 'next/router';

type Props = ButtonProps | LinkProps;

type CustomProps = {
  href: string;
};

export type DVSLinkProps = CustomProps & Props;

const DVSLink: React.FC<DVSLinkProps> = ({ href, children, as = 'a', variant, ...restProps }) => {
  const { pathname } = useRouter();
  const active = pathname === `/${href}`;
  let vr = variant;

  if (variant === 'navbar') {
    if (active) vr = 'navbarActive';
  }

  const LinkOrButton =
    as === 'a' ? (
      <Link variant={vr} {...(restProps as Partial<LinkProps>)}>
        {children}
      </Link>
    ) : (
      <Button {...(restProps as Partial<ButtonProps>)}>{children}</Button>
    );

  return (
    <NextLink passHref href={`/${href}`}>
      {LinkOrButton}
    </NextLink>
  );
};

export default DVSLink;
