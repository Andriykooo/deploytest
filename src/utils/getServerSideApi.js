import { cookies } from "next/headers";
import { apiServices } from "./apiServices";
import { apiUrl } from "./constants";

export async function getMainMenu() {
  const cookieStore = cookies();

  const lang = cookieStore.get("language");

  let contentLanguage = "all";

  if (lang?.value) {
    contentLanguage = lang.value === "en" ? "all" : lang.value;
  }

  return await apiServices
    .get(
      apiUrl.GET_MAIN_MENU,
      { country: contentLanguage },
      { withCredentials: true }
    )
    .then((response) => {
      return response.map((page, index) => ({
        ...page,
        id: index + 1,
        selected: false,
      }));
    });
}
