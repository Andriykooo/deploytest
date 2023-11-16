import { Footer } from "@/components/footer/Footer";
import { CasinoPage } from "@/screens/Casino/Casino";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { notFound } from "next/navigation";

async function getData(id) {
  return await apiServices.get(`${apiUrl.GET_GAME}?id=${id}`);
}

export default async function Page({ params }) {
  const data = await getData(params.gameId)
    .then((response) => {
      return { ...response, image_url: `${response.image_url}.png` };
    })
    .catch(() => {
      notFound();
    });

  return (
    <>
      <CasinoPage game={data} />
      <Footer />
    </>
  );
}
