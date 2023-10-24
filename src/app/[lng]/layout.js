import { Provider } from "./provider";
import { Montserrat } from "next/font/google";
import { apiUrl } from "@/utils/constants";
import Script from "next/script";
import { languages } from "../i18n/settings";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";

const montserrat = Montserrat({
  subsets: ["latin"],
  style: "normal",
});

export async function generateMetadata() {
  const response = await fetch(apiUrl.GET_GLOBAL_SEO);

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
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
  };
}

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout({ children, params: { lng } }) {
  let messages;
  try {
    messages = (await import(`../i18n/locales/${lng}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={lng}>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" />
      <body className={montserrat.className}>
        <NextIntlClientProvider locale={lng} messages={messages}>
          <Provider>{children}</Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
