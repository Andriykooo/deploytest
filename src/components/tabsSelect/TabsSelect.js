import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { MobileSelect } from "../mobileSelect/MobileSelect";

export const TabsSelect = ({
  onChange,
  data,
  placeholder,
  selectedItemId,
  variant = "scrollable",
}) => {
  const isTablet = useSelector((state) => state.isTablet);
  const [selectedItem, setSelectedItem] = useState(
    data.find((item) => item.id === selectedItemId)
  );

  const handleSelect = (item) => {
    setSelectedItem(item);
    onChange?.(item);
  };

  return !isTablet ? (
    <div className="markets-container">
      <Box>
        <Tabs
          variant={variant}
          value={data.find((item) => item.id === selectedItem?.id) || data[0]}
          scrollButtons="auto"
          allowScrollButtonsMobile
          onChange={(_, item) => {
            handleSelect(item);
          }}
        >
          {data?.map((item) => {
            return (
              <Tab
                label={item?.label}
                value={item}
                sx={{
                  color:
                    selectedItem?.label === item?.label ? "#ffffff" : "#A4A4A4",
                  textTransform: "none",
                  display: "flex",
                }}
                key={item.id}
              />
            );
          })}
        </Tabs>
      </Box>
    </div>
  ) : (
    <MobileSelect
      data={data}
      selectedItem={selectedItem}
      placeholder={placeholder || selectedItem?.label}
      onSelect={handleSelect}
    />
  );
};
