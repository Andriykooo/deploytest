import { Page as GeneratedPage } from "@/screens/Page/Page";
import { apiUrl } from "@/utils/constants";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const cookieStore = cookies();
  const lang = cookieStore.get("language");
  const defaultLanguage = lang?.value.toLowerCase() || "en";

  const country = defaultLanguage === "en" ? "all" : defaultLanguage;

  const response = await fetch(`${apiUrl.GET_MAIN_MENU}?country=${country}`, {
    credentials: "include",
  });

  if (response.status === 483) {
    return {
      title: "Customer Service Notice",
    };
  }

  const pages = await response.json();
  const page = pages.find((page) => page.path.substring(1) === params.path);

  const seo = {
    name: page?.name,
    title: page?.seo.title,
    description: page?.seo.description,
    keywords: page?.seo.keywords,
    openGraph: {
      title: page?.seo?.title,
      description: page?.seo?.description,
    },
  };

  if (page?.seo?.image) {
    seo.openGraph.images = [page?.seo?.image];
  }

  return seo;
}

export default async function Page({ params }) {
  const cookieStore = cookies();
  const lang = cookieStore.get("language");
  const defaultLanguage = lang?.value.toLowerCase() || "en";

  const country = defaultLanguage ? "all" : defaultLanguage;

  const response = await fetch(`${apiUrl.GET_MAIN_MENU}?country=${country}`, {
    credentials: "include",
  });

  if (response.status === 483) {
    return null;
  }

  const header = await response.json();
  const page = header.find((page) => page.path.substring(1) === params.path);

  if (!page) {
    notFound();
  }

  return <GeneratedPage />;
}
