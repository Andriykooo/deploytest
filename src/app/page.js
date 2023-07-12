import { Footer } from "@/components/footer/Footer";
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

async function getFooter() {
  return await apiServices.get(apiUrl.GET_FOOTER).then((response) => {
    return {
      ...response,
      images: response.images.map((row) => {
        return {
          ...row,
          items: row.items.map((image) => {
            return {
              ...image,
              path: image.url,
            };
          }),
        };
      }),
    };
  });
}

export default async function Page() {
  const data = await getData();
  const footer = await getFooter();

  return (
    <>
      <GeneratedPage data={data} />
      <Footer footerData={footer} />
    </>
  );
}
