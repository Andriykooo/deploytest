import { NextResponse } from "next/server";
import { fallbackLng, languages, cookieName } from "./app/i18n/settings";

export const config = {
  // matcher: '/:lng*'
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};

export function middleware(req) {
  const lng = req.cookies.has(cookieName)
    ? req.cookies.get(cookieName).value
    : fallbackLng;

  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    );
  }

  const [, locale, ...rest] = req.nextUrl.pathname.split("/");

  if (req.headers.has("referer")) {
    // redirect if locale is changed
    if (locale !== lng) {
      const pathname = rest.join("/");

      const response = NextResponse.redirect(
        new URL(`/${locale}/${pathname}${req.nextUrl.search}`, req.url)
      );
      response.cookies.set(cookieName, locale);
      return response;
    }
  }

  const cookieValue = req.cookies.has(cookieName)
    ? req.cookies.get(cookieName).value
    : "";

  // change cookie when user opens by path
  if (locale !== cookieValue) {
    const response = NextResponse.next();

    response.cookies.set(cookieName, locale);

    return response;
  }
}
