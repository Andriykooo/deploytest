import { Footer } from "@/components/footer/Footer";
import { CasinoPage } from "@/screens/Casino/Casino";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";

async function getData(id) {
  return await apiServices.get(`${apiUrl.GET_GAME}?pragmaticGameId=${id}`);
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

export default async function Page({ params }) {
  const data = await getData(params.gameId).then((response) => {
    return { ...response, image_url: `${response.image_url}.png` };
  });

  const footer = await getFooter();

  return (
    <>
      <CasinoPage game={data} />
      <Footer footerData={footer} />
    </>
  );
}
