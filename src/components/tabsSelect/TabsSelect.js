import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MobileSelect } from "../mobileSelect/MobileSelect";
import { Button } from "../button/Button";
import classNames from "classnames";
import "./TabSelect.css";

export const TabsSelect = ({
  onChange,
  data,
  placeholder,
  selectedItemId,
  selectedItemLabel,
  variant = "scrollable",
  withBtns,
}) => {
  const isTablet = useSelector((state) => state.isTablet);
  const [selectedItem, setSelectedItem] = useState(
    data?.find(
      (item) =>
        item.id === selectedItemId &&
        (item.label === selectedItemLabel || !selectedItemLabel)
    )
  );

  useEffect(() => {
    if (selectedItemId) {
      setSelectedItem(
        data?.find(
          (item) =>
            item.id === selectedItemId &&
            (item.label === selectedItemLabel || !selectedItemLabel)
        )
      );
    }
  }, [selectedItemId, selectedItemLabel]);

  const handleSelect = (item) => {
    setSelectedItem(item);
    onChange?.(item);
  };

  return !isTablet ? (
    <div className="markets-container">
      <ul variant={variant} className={classNames("TabSelect", variant)}>
        {data?.map((item, index) => {
          return (
            <li
              onClick={() => handleSelect(item)}
              key={item.id + item.label}
              className={classNames("TabSelectItem", {
                active: selectedItem?.id
                  ? item?.id === selectedItem?.id &&
                    item?.label === selectedItem?.label
                  : index === 0,
              })}
            >
              {item?.label}
            </li>
          );
        })}
      </ul>
    </div>
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
    <MobileSelect
      data={data}
      selectedItem={selectedItem}
      placeholder={placeholder || selectedItem?.label}
      onSelect={handleSelect}
    />
  );
};
