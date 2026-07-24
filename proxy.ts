import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    console.log(request,"request");
    const pathname=request.nextUrl.pathname;
    console.log("pathname", pathname);
    console.log(proxy);
  return NextResponse.redirect(new URL('/', request.url))
}
 
export const config = {
  matcher: '/dashboard/:path*',
}