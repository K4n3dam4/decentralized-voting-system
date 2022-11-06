import { NextRequest, NextResponse } from 'next/server';
import routes, { protectedRoutes } from './config/routes';
import { deleteCookie } from './utils/cookies';

export default async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const accessToken = cookies.get('access_token');

  const checker = (path: string) => protectedRoutes.some((route) => path.includes(route));

  const rejected = () => {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    const redirect = NextResponse.redirect(redirectUrl);
    deleteCookie(req, redirect, 'access_token');
    return redirect;
  };

  // path is protected - clearance user
  if (checker(nextUrl.pathname)) {
    if (accessToken) {
      const adminRoute = nextUrl.pathname.includes(routes.Admin);
      const url = req.nextUrl.origin + `/api/auth/verify/${adminRoute ? 'admin' : 'voter'}`;
      try {
        const validate = await fetch(url, { method: req.method, headers: { Authorization: accessToken } });
        if (validate.status === 200) {
          return NextResponse.next();
        } else {
          return rejected();
        }
      } catch (e) {
        console.error(e);
        return rejected();
      }
    } else {
      return rejected();
    }
  }
}
