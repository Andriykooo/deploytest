import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import "bootstrap/dist/css/bootstrap.min.css";
import { Montserrat } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./globals.css";
import { Provider } from "./provider";

const montserrat = Montserrat({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

async function getData() {
  return await apiServices.get(apiUrl.GET_MAIN_MENU).then((response) => {
    return response.map((page, index) => ({
      ...page,
      id: index + 1,
      selected: false,
    }));
  });
}

export const metadata = {
  images: [
    "https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg",
  ],
  openGraph: {
    images: [
      "https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg",
    ],
  },
};

export async function generateMetadata() {
  const seo = await apiServices.get(apiUrl.GET_GLOBAL_SEO);

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
  const header = await getData();

  return (
    <html lang="en">
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://backoffice-dev.swifty-api.com/api/v1/settings/css/content.css"
        />
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" />
      <body className={montserrat.className}>
        <Provider header={header}>{children}</Provider>
      </body>
    </html>
  );
}
