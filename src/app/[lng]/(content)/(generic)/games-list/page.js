import { GamesList } from "@/screens/GamesList/GamesList";
import { apiUrl } from "@/utils/constants";
import axios from "axios";

async function fetchGameList() {
  const res = await axios.get(`${apiUrl.GET_PAGE_LAYOUT}?value=casino`);
  return await res?.data?.content?.find((item) => item.type === "casino")
    .casino;
}

export default async function Page() {
  const gameList = await fetchGameList();
  return <GamesList data={gameList} />;
}
