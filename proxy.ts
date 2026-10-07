import { NextRequest, NextResponse } from "next/server";

function proxy(request: NextRequest) {
  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/admin/:path*"],
};
