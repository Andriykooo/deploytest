import { Montserrat } from "next/font/google";
import { apiUrl, fallbackLng } from "@/utils/constants";
import { NextIntlClientProvider } from "next-intl";
import { ReduxLayout } from "@/store/provider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  preload: true,
  weight: ["400", "500", "600", "700"],
  style: "normal",
  display: "swap",
});

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
