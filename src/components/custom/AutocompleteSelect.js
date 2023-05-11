import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { theme } from "../../utils/config";
import { ArrowDownIcon } from "../../utils/icons";
import { MobileSelect } from "../mobileSelect/MobileSelect";

export const AutocompleteSelect = ({ placeholder, data, onSelect }) => {
  const location = useLocation();
  const isMobile = useSelector((state) => state.setMobile);

  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (item) => {
    onSelect(item);
    setSelectedItem(item);
  };

  useEffect(() => {
    setSelectedItem(null);
    onSelect?.(null);
  }, [location]);

  return !isMobile ? (
    <Autocomplete
      popupIcon={<ArrowDownIcon />}
      id="autocomplete-competition"
      options={data}
      value={selectedItem}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      sx={{
        width: "100%",
        height: "50px",
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
      placeholder={selectedItem?.label || placeholder}
      onSelect={handleSelect}
    />
  );
};
