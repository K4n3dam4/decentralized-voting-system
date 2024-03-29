import { NextRequest, NextResponse } from 'next/server';

/**
 * Delete cookie ssr
 * @param request
 * @param response
 * @param cookie
 */
const deleteCookie = (request: NextRequest, response: NextResponse, cookie: string) => {
  const { value, options } = request.cookies.getWithOptions(cookie);
  if (value) {
    response.cookies.set(cookie, value, options);
    response.cookies.delete(cookie);
  }
};

export { deleteCookie };
