import { NextResponse } from "next/server";
import { fallbackLng } from "./app/i18n/settings";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(request) {
  console.log(request.nextUrl.pathname);
  if (request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL(`/${fallbackLng}`, request.url));
  }
}
