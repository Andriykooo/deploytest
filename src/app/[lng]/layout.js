import Script from "next/script";
import { Provider } from "./provider";
import { Montserrat } from "next/font/google";
import { apiUrl, fallbackLng } from "@/utils/constants";
import { NextIntlClientProvider } from "next-intl";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PwaInstall } from "@/components/pwa/PwaInstall";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  preload: true,
  weight: ["400", "600", "700"],
  style: "normal",
  display: "swap",
});

export async function generateMetadata() {
  const response = await fetch(apiUrl.GET_GLOBAL_SEO, {
    next: { revalidate: 3 },
  });

  if (response.status === 483) {
    return {
      title: "Customer Service Notice",
    };
  }

  const seo = await response.json();

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    icons: {
      icon: seo.fav_icon,
      shortcut: seo.fav_icon,
      apple: seo.fav_icon,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
    manifest: "/manifest.json",
  };
}

export const viewport = {
  themeColor: "#2B2F34",
  viewport:
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0",
};

export default async function RootLayout({ children, params: { lng } }) {
  let locales;

  const onboarding = await fetch(apiUrl.ON_BOARDING, {
    next: { revalidate: 3 },
  });
  const data = await onboarding.json();

  if (!data.languages.some((language) => language.code2 === lng)) {
    const cookieStore = cookies();

    redirect(`/${cookieStore.get("language")?.value || fallbackLng}`);
  }

  try {
    locales = (await import(`../../locales/${lng}.json`)).default;
  } catch (error) {
    locales = (await import(`../../locales/${fallbackLng}.json`)).default;
  }

  return (
    <html lang={lng}>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"
        strategy="lazyOnload"
      />
      <Script
        strategy="lazyOnload"
        src="https://connect.facebook.net/en_US/sdk.js"
      />
      <Script
        strategy="lazyOnload"
        src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
      />
      <body className={montserrat.className}>
        <NextIntlClientProvider locale={lng} messages={locales}>
          <Provider>
            {children}
            <SpeedInsights />
            <PwaInstall />
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
