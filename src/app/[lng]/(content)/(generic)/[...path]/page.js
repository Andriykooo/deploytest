import { PageLayout } from "@/layouts/pageLayout/PageLayout";
import { apiUrl } from "@/utils/constants";
import axios from "axios";
import { notFound } from "next/navigation";

export const revalidate = 10;

export async function generateMetadata({ params }) {
  const response = await axios.get(apiUrl.GET_MAIN_MENU);

  if (response.status === 483) {
    return {
      title: "Customer Service Notice",
    };
  }

  const pages = response.data;
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

export async function generateStaticParams() {
  const pages = await axios.get(apiUrl.GET_MAIN_MENU);

  return pages.data.map((page) => {
    return { path: [page.path.substring(1)] };
  });
}

export default async function Page({ params }) {
  const response = await axios.get(apiUrl.GET_MAIN_MENU);

  if (params.path.length > 1) {
    notFound();
  }

  const pages = response.data;

  const page = pages.find((page) => page.path.substring(1) === params.path[0]);

  if (!page) {
    notFound();
  }

  return <PageLayout slug={page.slug} />;
}
