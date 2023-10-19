import { apiUrl } from "@/utils/constants";

export default async function manifest() {
  const seoResponse = await fetch(apiUrl.GET_GLOBAL_SEO);
  const settingsResponse = await fetch(apiUrl.GET_SETTINGS);

  const seo = await seoResponse.json();
  const settings = await settingsResponse.json();

  return {
    name: settings.companyName,
    short_name: seo.title,
    description: seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: seo.fav_icon,
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
