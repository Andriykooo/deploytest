import { Page as GeneratedPage } from "@/screens/Page/Page";
import { apiUrl } from "@/utils/constants";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const response = await fetch(apiUrl.GET_MAIN_MENU);

  if (response.status === 483) {
    return {};
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
  const response = await fetch(apiUrl.GET_MAIN_MENU);

  if (response.status !== 483) {
    const pages = await response.json();

    const page = pages.find((page) => page.path.substring(1) === params.path);

    if (!page) {
      notFound();
    }
  }

  return <GeneratedPage />;
}
