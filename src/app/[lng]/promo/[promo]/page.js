import Affiliates from "@/screens/Affiliates/Affiliates";
import { apiUrl } from "@/utils/constants";
import { notFound } from "next/navigation";

async function fetchData(params) {
  const res = await fetch(
    `${apiUrl.GET_AFFILIATES}${params.promo}&${params.lng}`
  );
  return await res.json();
}

export async function generateMetadata({ params }) {
  const affiliatesData = await fetchData(params.promo);

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
  const affiliatesData = await fetchData(params);

  if (affiliatesData?.errCode === "1035") {
    notFound();
  }

  return <Affiliates data={affiliatesData} promo={params.promo} />;
}
