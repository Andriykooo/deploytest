import { apiUrl } from "@/utils/constants";

export async function GET() {
  const response = await fetch(apiUrl.GET_GLOBAL_SEO, {
    next: { revalidate: 3 },
  });
  const seo = await response.json();

  const manifestTemplate = {
    name: seo.title,
    short_name: seo.title,
    start_url: "/",
    scope: "/",
    background_color: "#2B2F34",
    theme_color: "#2B2F34",
    display: "standalone",
    description: seo.description,
    icons: [
      {
        src: seo.fav_icon,
        sizes: "144x144",
        purpose: "any maskable",
      },
      {
        src: seo.fav_icon,
        sizes: "512x512",
        purpose: "any maskable",
      },
    ],
    screenshots: [
      {
        src: "screenshots/mobile-1.jpg",
        sizes: "375x856",
        type: "image/jpeg",
      },
      {
        src: "screenshots/mobile-2.jpg",
        sizes: "375x856",
        type: "image/jpeg",
      },
      {
        src: "screenshots/mobile-3.jpg",
        sizes: "375x856",
        type: "image/jpeg",
      },
      {
        src: "screenshots/tablet-1.jpg",
        sizes: "1200x800",
        type: "image/jpeg",
        form_factor: "wide",
      },
      {
        src: "screenshots/tablet-2.jpg",
        sizes: "1200x800",
        type: "image/jpeg",
        form_factor: "wide",
      },
    ],
  };

  return Response.json(manifestTemplate);
}
