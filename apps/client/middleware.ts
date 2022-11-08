import { NextRequest, NextResponse } from 'next/server';
import routes from './config/routes';
import { deleteCookie } from './utils/cookies';

export default async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const accessToken = cookies.get('access_token');

  const rejected = () => {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    const redirect = NextResponse.redirect(redirectUrl);
    deleteCookie(req, redirect, 'access_token');
    return redirect;
  };

  // path is protected - clearance user
  if (accessToken) {
    const url = req.nextUrl.origin + `/api/auth/verify`;

    try {
      const validate = await fetch(url, { method: req.method, headers: { Authorization: `Bearer ${accessToken}` } });

      // jwt is valid
      if (validate.status === 200) {
        const adminRoute = nextUrl.pathname.includes(routes.Admin);

        // protect admin routes
        if (adminRoute) {
          const { role } = await validate.json();

          // insufficient rights
          if (role === 'VOTER') return rejected();
        }

        // sufficient rights
        return NextResponse.next();
      } else {
        // jwt is invalid
        return rejected();
      }
    } catch (e) {
      // server error reject
      console.error(e);
      return rejected();
    }
  } else {
    // no jwt on protected route
    return rejected();
  }
}

export const config = {
  matcher: ['/election/:path*', '/admin/:path*'],
};
