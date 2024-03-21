import { PageLayout } from "@/layouts/pageLayout/PageLayout";
import { apiUrl } from "@/utils/constants";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const defaultLanguage = params.lng || "en";

  const country = defaultLanguage === "en" ? "all" : defaultLanguage;

  const response = await fetch(`${apiUrl.GET_MAIN_MENU}?country=${country}`, {
    next: { revalidate: 10 },
  });

  if (response.status === 483) {
    return {
      title: "Customer Service Notice",
    };
  }

  const pages = await response.json();
  const page = pages.find((page) => page.path.substring(1) === params.path[0]);

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
  const response = await fetch(apiUrl.GET_MAIN_MENU, {
    next: { revalidate: 10 },
  });

  if (params.path.length > 1) {
    notFound();
  }

  const pages = await response.json();

  const page = pages.find((page) => page.path.substring(1) === params.path[0]);

  if (!page) {
    notFound();
  }

  return <PageLayout slug={page.slug} />;
}
