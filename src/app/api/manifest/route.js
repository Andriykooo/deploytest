import { apiUrl } from "@/utils/constants";

export async function GET() {
  const response = await fetch(apiUrl.GET_GLOBAL_SEO);
  const seo = await response.json();

  const manifestTemplate = {
    background_color: "#2B2F34",
    theme_color: "#2B2F34",
    display: "standalone",
    scope: "/",
    start_url: "/",
    name: seo.title,
    short_name: seo.title,
    description: seo.description,
    icons: [
      {
        src: seo.fav_icon,
        sizes: "144x144",
        purpose: "any maskable",
      },
      {
        src: seo.image,
        sizes: "512x512",
        purpose: "any maskable",
      },
    ],
  };

  return Response.json(manifestTemplate);
}
