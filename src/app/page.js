import { apiUrl, fallbackLng } from "@/utils/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export default function Page() {
  const cookieStore = cookies();
  const language = cookieStore.get("language")?.value || fallbackLng;

  redirect(`/${language}`);
}
