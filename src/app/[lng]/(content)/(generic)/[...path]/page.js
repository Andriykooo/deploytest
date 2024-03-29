import { PageLayout } from "@/layouts/pageLayout/PageLayout";
import { apiUrl } from "@/utils/constants";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const response = await fetch(apiUrl.GET_MAIN_MENU, {
    next: { revalidate: 10 },
  });

  const pages = await response.json();

  const page = pages.find((page) => {
    return page.path.substring(1) === params.path[0];
  });

  if (!page) {
    notFound();
  }

  return <PageLayout slug={page?.slug || "index"} />;
}
