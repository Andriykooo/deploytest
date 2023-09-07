import MatchDetails from "@/components/matches/MatchDetails";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { notFound } from "next/navigation";

async function getData(id) {
  try {
    if (typeof id === "string") {
      return await apiServices.get(`${apiUrl.MATCH_DETAILS}?eventId=${id}`);
    }
  } catch {
    notFound();
  }
}

export default async function Page({ params }) {
  const data = await getData(params.id);

  return <MatchDetails data={data} id={params.id} />;
}
