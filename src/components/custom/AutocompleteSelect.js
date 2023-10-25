import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { theme } from "../../utils/config";
import { ArrowDownIcon } from "../../utils/icons";
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
    <Autocomplete
      popupIcon={<ArrowDownIcon />}
      noOptionsText={t("no_options")}
      id="autocomplete-competition"
      options={data}
      value={selectedItem}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      sx={{
        width: "100%",
        color: theme?.colors?.colorTextPrimary,
      }}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.id}>
            {option?.label}
          </li>
        );
      }}
      renderInput={(params) => {
        return (
          <TextField placeholder={placeholder} {...params} variant="outlined" />
        );
      }}
      onChange={(_, item) => {
        handleSelect(item);
      }}
    />
  ) : (
    <MobileSelect
      data={data}
      selectedItem={selectedItem}
      placeholder={placeholder}
      onSelect={handleSelect}
    />
  );
};
