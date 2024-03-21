import { NextResponse } from "next/server";
import { fallbackLng } from "./utils/constants";
import {
  redirectCasinoParams,
  redirectCasinoUrls,
} from "./utils/redirectCasinoParams";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const params = req.nextUrl.searchParams;
  const language = req.cookies.get("language")?.value || fallbackLng;

  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const filteredCasinoUrl = redirectCasinoUrls.find(
    ({ url }) => params.get(url) !== null
  );

  if (filteredCasinoUrl)
    return redirectCasinoParams(filteredCasinoUrl, {
      NextResponse,
      language,
      req,
    });

  if (pathname.split("/").length < 3) {
    return NextResponse.redirect(new URL(`/${language}/index`, req.url));
  }
}
