import { Page as GeneratedPage } from "@/screens/Page/Page";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { notFound } from "next/navigation";

async function getData(path) {
  const pages = await apiServices.get(apiUrl.GET_MAIN_MENU);
  const page = pages.find((page) => page.path.substring(1) === path);

  if (!page) {
    notFound();
  }

  const layout = await apiServices
    .get(apiUrl.GET_PAGE_LAYOUT, {
      value: page.slug,
      country: "all",
    })
    .then((response) => ({
      ...response,
      page,
    }));

  if (!!layout.show_betslip) {
    layout.sidebar_left = await apiServices.get(apiUrl.GET_SIDEBAR_LEFT);
  }

  if (!!layout.show_sidebar) {
    layout.sidebar_right = await apiServices.get(apiUrl.GET_SIDEBAR_RIGHT);
  }

  return layout;
}

export async function generateMetadata({ params }) {
  const pages = await apiServices.get(apiUrl.GET_MAIN_MENU);
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
  const data = await getData(params.path);

  return <GeneratedPage data={data} />;
}
