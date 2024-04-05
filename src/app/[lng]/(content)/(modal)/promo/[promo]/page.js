import Affiliates from "@/screens/Affiliates/Affiliates";
import { apiUrl } from "@/utils/constants";
import axios from "axios";

export const dynamic = "force-static";

async function fetchLandingPage(params) {
  const res = axios.get(
    `${apiUrl.GET_AFFILIATES}?affiliate_slug=${params.promo}`
  );
  return res.data;
}

export async function generateMetadata({ params }) {
  const affiliatesData = await fetchLandingPage(params.promo);

  if (affiliatesData?.errCode === "1035") {
    return {};
  }

  const seo = {
    title: affiliatesData?.title,
    description: affiliatesData?.seo_description,
    keywords: affiliatesData?.seo_keywords,
    openGraph: {
      title: affiliatesData?.seo_title,
      description: affiliatesData?.seo_description,
      images: [affiliatesData?.seo_image],
    },
  };

  return seo;
}

export default function Page({ params }) {
  return <Affiliates promo={params.promo} />;
}
