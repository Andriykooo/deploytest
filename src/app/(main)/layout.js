import { Provider } from "./provider";
import { apiUrl } from "@/utils/constants";

export default async function Layout({ children }) {
  const response = await fetch(apiUrl.GET_MAIN_MENU);
  const header = response.status !== 483 ? await response.json() : [];

  return <Provider header={header}>{children}</Provider>;
}
