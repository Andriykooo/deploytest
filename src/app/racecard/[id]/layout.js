import { Footer } from "@/components/footer/Footer";
import { SidebarLayout } from "@/layouts/sidebarLayout/SidebarLayout";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";

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

async function getSidebarLeft() {
  return await apiServices.get(apiUrl.GET_SIDEBAR_LEFT);
}

async function getSidebarRight() {
  return await apiServices.get(apiUrl.GET_SIDEBAR_RIGHT);
}

export default async function Layout({ children }) {
  const footer = await getFooter();
  const sidebarLeft = await getSidebarLeft();
  const sidebarRight = await getSidebarRight();

  return (
    <>
      <SidebarLayout
        leftData={sidebarLeft}
        rightData={sidebarRight}
        className="sportsBackground"
      >
        {children}
        <Footer footerData={footer} />
      </SidebarLayout>
    </>
  );
}
