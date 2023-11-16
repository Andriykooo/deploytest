import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "../i18n";

export default createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
