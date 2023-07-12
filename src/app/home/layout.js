import { Footer } from "@/components/footer/Footer";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";

async function getData() {
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

export default async function Layout({ children }) {
  const footer = await getData();

  return (
    <>
      {children}
      <Footer footerData={footer} />
    </>
  );
}
