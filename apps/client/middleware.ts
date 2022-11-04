import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const accessToken = cookies.get('access_token');

  const splitPath = nextUrl.pathname.split('/');
  const protectedRoutes = ['election', 'auth'];

  const checker = (pathArray: string[]) => protectedRoutes.some((route) => pathArray.includes(route));

  // path is not root
  if (checker(splitPath)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';

    if (accessToken) {
      const url = req.nextUrl.origin + '/api/auth/verify';
      try {
        const validate = await fetch(url, { method: req.method, headers: { Authorization: accessToken } });
        if (validate.status === 403) {
          console.log(validate.status);
          const redirect = NextResponse.redirect(redirectUrl);
          redirect.cookies.delete('access_token');
          return redirect;
        } else {
          return NextResponse.next();
        }
      } catch (e) {
        console.error(e);
        return NextResponse.redirect(redirectUrl);
      }
    } else {
      return NextResponse.redirect(redirectUrl);
    }
  }
}
