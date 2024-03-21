import { CasinoPage } from "@/screens/Casino/Casino";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { notFound } from "next/navigation";

async function getData(id) {
  try {
    return await apiServices.get(`${apiUrl.GET_GAME}?id=${id}`);
  } catch {
    notFound();
  }
}

export default async function Page({ params }) {
  const data = await getData(params.gameId);

  if (!data) {
    notFound();
  }

  return <CasinoPage game={data} />;
}
