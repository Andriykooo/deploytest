import { Footer } from "@/components/footer/Footer";
import { CasinoPage } from "@/screens/Casino/Casino";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";

async function getData(id) {
  return await apiServices.get(`${apiUrl.GET_GAME}?pragmaticGameId=${id}`);
}

export default async function Page({ params }) {
  const data = await getData(params.gameId).then((response) => {
    return { ...response, image_url: `${response.image_url}.png` };
  });

  return (
    <>
      <CasinoPage game={data} />
      <Footer />
    </>
  );
}
