import { PageLayout } from "@/layouts/pageLayout/PageLayout";
import { apiUrl } from "@/utils/constants";
import axios from "axios";

export const revalidate = 10;

export async function generateMetadata() {
  const response = await axios.get(apiUrl.GET_MAIN_MENU);

  if (response.status === 483) {
    return {
      title: "Customer Service Notice",
    };
  }

  const pages = response.data;
  const page = pages.find((page) => page.path.substring(1) === "index");

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

export default function Page() {
  return <PageLayout slug="index" />;
}
