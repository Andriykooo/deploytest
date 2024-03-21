import Affiliates from "@/screens/Affiliates/Affiliates";
import { apiUrl } from "@/utils/constants";

async function fetchLandingPage(params) {
  const res = await fetch(
    `${apiUrl.GET_AFFILIATES}?affiliate_slug=${params.promo}`
  );
  return await res.json();
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

export default async function Page({ params }) {
  return <Affiliates promo={params.promo} />;
}
