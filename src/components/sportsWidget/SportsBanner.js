import { useEffect, useState } from "react";
import { BannerMenu } from "../bannerMenu/BannerMenu";
import { useClientTranslation } from "@/app/i18n/client";

export const SportsBanner = ({ data, title, subtitle, setData, image }) => {
  const { t } = useClientTranslation("sports");
  const [selectedFilter, setSelectedFilter] = useState({
    name: t("all_sports"),
    slug: "all",
  });

  const handleFilter = (selectedItem) => {
    if (selectedItem) {
      setSelectedFilter(selectedItem);
      setData?.(
        selectedItem?.slug === "all"
          ? data.sports
          : data.sports.filter((sport) => {
              return selectedItem ? selectedItem.slug === sport.slug : true;
            })
      );
    }
  };

  const options = data?.sports?.map((sport) => ({
    ...sport,
    name: sport.name,
  }));

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
        options?.length > 0
          ? [{ name: t("all_sports"), slug: "all" }, ...options]
          : []
      }
      setSelected={handleFilter}
      selected={selectedFilter}
    />
  );
};
