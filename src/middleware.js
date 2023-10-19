import { languages } from "./app/i18n/settings";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};

export function middleware(request) {
  const locale = "en";
  const { pathname } = request.nextUrl;

  // console.log(languages, pathname, !languages.some((lang) => pathname.startsWith(`/${lang}`)));
  // if (!languages.some((lang) => pathname.startsWith(`/${lang}`))) {
  //   request.nextUrl.pathname = `/${locale}${pathname}`;
  //   return Response.redirect(request.nextUrl);
  // }
}
