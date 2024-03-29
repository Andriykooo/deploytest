import { Montserrat } from "next/font/google";
import { apiUrl, fallbackLng } from "@/utils/constants";
import { NextIntlClientProvider } from "next-intl";
import { ReduxLayout } from "@/store/provider";
import "./globals.css";
import axios from "axios";

const montserrat = Montserrat({
  subsets: ["latin"],
  preload: true,
  weight: ["400", "500", "600", "700"],
  style: "normal",
  display: "swap",
});

export const revalidate = 10;

export async function generateStaticParams() {
  const onboarding = await axios.get(apiUrl.ON_BOARDING);

  return onboarding.data.languages.map((language) => {
    return { lng: language.code2 };
  });
}

export default async function RootLayout({ children, params: { lng } }) {
  let locales;

  try {
    locales = (await import(`../../locales/${lng}.json`)).default;
  } catch (error) {
    locales = (await import(`../../locales/${fallbackLng}.json`)).default;
  }

  return (
    <html lang={lng}>
      <body className={montserrat.className}>
        <NextIntlClientProvider locale={lng} messages={locales}>
          <ReduxLayout>{children}</ReduxLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
