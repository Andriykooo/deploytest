import { Page as GeneratedPage } from "@/screens/Page/Page";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";

async function getData() {
  const layout = await apiServices.get(apiUrl.GET_PAGE_LAYOUT, {
    value: "home_page",
    country: "all",
  });

  if (!!layout.show_betslip) {
    layout.sidebar_left = await apiServices.get(apiUrl.GET_SIDEBAR_LEFT);
  }

  if (!!layout.show_sidebar) {
    layout.sidebar_right = await apiServices.get(apiUrl.GET_SIDEBAR_RIGHT);
  }

  return layout;
}

export async function generateMetadata() {
  const pages = await apiServices.get(apiUrl.GET_MAIN_MENU);
  const page = pages.find((page) => page.path.substring(1) === "home");

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

export default async function Page() {
  const data = await getData();

  return <GeneratedPage data={data} />;
}
