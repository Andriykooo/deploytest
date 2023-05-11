import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { theme } from "../../utils/config";
import { MobileSelect } from "../mobileSelect/MobileSelect";

export const TabsSelect = ({ onChange, data, placeholder }) => {
  const isMobile = useSelector((state) => state.setMobile);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (item) => {
    setSelectedItem(item);
    onChange?.(item);
  };

  return !isMobile ? (
    <div className="markets-container">
      <Box>
        <Tabs
          variant="scrollable"
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
                  minWidth: "fit-content",
                  flex: 1,
                  color: theme?.colors?.colorTextPrimary,
                  borderBottom:
                    selectedItem?.label === item?.label
                      ? "4px solid #BC9239 !important"
                      : "none",
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
