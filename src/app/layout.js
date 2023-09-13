import { Montserrat } from "next/font/google";
import { apiUrl } from "@/utils/constants";
import { cookies } from "next/headers";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./globals.css";

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

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const lang = cookieStore.get("language");

  return (
    <html lang={lang?.value?.toLowerCase() || "en"}>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" />
      <body className={montserrat.className}>
        <p>{children}</p>
      </body>
    </html>
  );
}
