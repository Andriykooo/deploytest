import { apiUrl } from "@/utils/constants";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(apiUrl.GET_GLOBAL_SEO);
    const seo = response.data;

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
          src: "https://swifty-global-app-assets-central.s3.eu-west-1.amazonaws.com/website/pwa/1.jpeg",
          sizes: "375x856",
          type: "image/jpeg",
        },
        {
          src: "https://swifty-global-app-assets-central.s3.eu-west-1.amazonaws.com/website/pwa/2.jpeg",
          sizes: "375x856",
          type: "image/jpeg",
        },
        {
          src: "https://swifty-global-app-assets-central.s3.eu-west-1.amazonaws.com/website/pwa/3.jpeg",
          sizes: "375x856",
          type: "image/jpeg",
        },
        {
          src: "https://swifty-global-app-assets-central.s3.eu-west-1.amazonaws.com/website/pwa/4.jpeg",
          sizes: "1200x800",
          type: "image/jpeg",
          form_factor: "wide",
        },
      ],
    };

    return Response.json(manifestTemplate);
  } catch {
    return Response.json("{}");
  }
}
