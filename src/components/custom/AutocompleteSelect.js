import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MobileSelect } from "../mobileSelect/MobileSelect";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export const AutocompleteSelect = ({ placeholder, data, onSelect }) => {
  const pathname = usePathname();
  const isTablet = useSelector((state) => state.isTablet);
  const [selectedItem, setSelectedItem] = useState(null);
  const t = useTranslations("common");

  const handleSelect = (item) => {
    onSelect(item);
    setSelectedItem(item);
  };
  useEffect(() => {
    setSelectedItem(null);
    onSelect?.(null);
  }, [pathname]);

  return !isTablet ? (
   null
  ) : (
    <MobileSelect
      data={data}
      selectedItem={selectedItem}
      placeholder={placeholder}
      onSelect={handleSelect}
    />
  );
};
