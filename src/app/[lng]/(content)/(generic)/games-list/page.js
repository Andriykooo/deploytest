import { GamesList } from "@/screens/GamesList/GamesList";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";

async function fetchGameList() {
  const res = await apiServices.get(apiUrl.GET_PAGE_LAYOUT, {
    value: "casino",
  });
  return await res?.content?.find((item) => item.type === "casino").casino;
}

export default async function Page() {
  const gameList = await fetchGameList();
  return <GamesList data={gameList} />;
}
