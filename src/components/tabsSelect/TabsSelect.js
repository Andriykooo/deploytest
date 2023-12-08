import { useState } from "react";
import { useSelector } from "react-redux";
import { MobileSelect } from "../mobileSelect/MobileSelect";
import { Button } from "../button/Button";
import classNames from "classnames";

export const TabsSelect = ({
  onChange,
  data,
  placeholder,
  selectedItemId,
  variant = "scrollable",
  withBtns,
}) => {
  const isTablet = useSelector((state) => state.isTablet);
  const [selectedItem, setSelectedItem] = useState(
    data?.find((item) => item.id === selectedItemId)
  );

  const handleSelect = (item) => {
    setSelectedItem(item);
    onChange?.(item);
  };

  return !isTablet ? (
    <div className="markets-container"></div>
  ) : withBtns ? (
    <div className="navigationBtns">
      {data.map((item) => (
        <Button
          key={item.id}
          className={classNames({
            btnPrimary: (selectedItem?.label || data[0].label) === item?.label,
          })}
          text={item.label}
          onClick={() => handleSelect(item)}
        />
      ))}
    </div>
  ) : (
    <div>
      <MobileSelect
        data={data}
        selectedItem={selectedItem}
        placeholder={placeholder || selectedItem?.label}
        onSelect={handleSelect}
      />
    </div>
  );
};
