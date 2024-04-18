import { useEffect, useState } from "react";
import { BannerMenu } from "../bannerMenu/BannerMenu";
import { useTranslations } from "@/hooks/useTranslations";

export const SportsBanner = ({
  data,
  title,
  subtitle,
  setFilter,
  image,
  disableCta,
}) => {
  const t = useTranslations("sports");
  const [selectedFilter, setSelectedFilter] = useState({
    name: t("all_sports"),
    slug: "all",
  });

  const handleFilter = (selectedItem) => {
    if (selectedItem) {
      setFilter(selectedItem);
      setSelectedFilter(selectedItem);
    }
  };

  useEffect(() => {
    if (data) {
      handleFilter();
    }
  }, [data]);

  return (
    <BannerMenu
      callToActinButton={{
        name: data?.details?.call_to_action,
        type: data?.details?.link_type,
        path: data?.details?.link,
        openType: data?.details?.open_type,
        modalData: {
          slug: data?.details?.link,
          name: data?.details?.call_to_actio,
        },
      }}
      title={title}
      subtitle={subtitle}
      image={image}
      options={
        data?.sports?.length > 0
          ? [{ name: t("all_sports"), slug: "all" }, ...data.sports]
          : []
      }
      setSelected={handleFilter}
      selected={selectedFilter}
      disableCta={disableCta}
    />
  );
};
