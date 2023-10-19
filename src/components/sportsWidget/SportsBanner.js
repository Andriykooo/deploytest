import { useEffect, useState } from "react";
import { BannerMenu } from "../bannerMenu/BannerMenu";

export const SportsBanner = ({ data, title, subtitle, setData, image }) => {
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleFilter = (selectedItem) => {
    setSelectedFilter(selectedItem);
    setData(
      data.sports.filter((sport) => {
        return selectedItem ? selectedItem.slug === sport.slug : true;
      })
    );
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
      title={title}
      subtitle={subtitle}
      image={image}
      options={options}
      setSelected={handleFilter}
      selected={selectedFilter}
    />
  );
};
