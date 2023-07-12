import MatchDetails from "@/components/matches/MatchDetails";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";

async function getData(id) {
  return await apiServices.get(`${apiUrl.MATCH_DETAILS}/${id}`);
}

export default async function Page({ params }) {
  const data = await getData(params.id);

  return <MatchDetails data={data} id={params.id} />;
}
