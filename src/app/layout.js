import { apiUrl } from "@/utils/constants";
import axios from "axios";

export const revalidate = 10;

export async function generateMetadata() {
  const response = await axios.get(apiUrl.GET_GLOBAL_SEO);

  if (response.status === 483) {
    return {
      title: "Customer Service Notice",
    };
  }

  const seo = response.data;

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
    themeColor: "#2B2F34",
    manifest: "/manifest.webmanifest",
  };
}

export const viewport = {
  viewport:
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0",
};

export default function Layout({ children }) {
  return children;
}
