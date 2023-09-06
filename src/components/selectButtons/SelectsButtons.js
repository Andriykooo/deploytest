import classNames from "classnames";
import { Button } from "../button/Button";
import { Carousel } from "../carousel/Carousel";
import { useEffect, useState } from "react";

export const SelectButtons = ({ data, onSelect, selectedId, borders, fullWidth }) => {
  const [active, setActive] = useState(selectedId || data[0]?.id);

  useEffect(() => {
    if (selectedId) {
      setActive(selectedId);
    }
  }, [selectedId]);

  return (
    <div className={classNames("selected-buttons", {
      "fullWidth": fullWidth
    })}>
      {fullWidth ? (
        <>
          {data.map((item) => {
            return (
              <Button
                key={item.id}
                id={item.id}
                text={item.label}
                className={classNames(
                  {
                    btnPrimary: active === item.id && !borders,
                    btnBorder: active === item.id && borders,
                    btnGray: active !== item.id,
                  },
                  "selected-button֊fullWidth"
                )}
                onClick={() => {
                  setActive(item.id);
                  onSelect(item);
                }}
              />
            )
          })}
        </>
      ) : (
        <Carousel
          data={data.map((item) => {
            return {
              id: item.id,
              render: (
                <Button
                  id={item.id}
                  text={item.label}
                  className={classNames(
                    {
                      btnPrimary: active === item.id && !borders,
                      btnBorder: active === item.id && borders,
                      btnGray: active !== item.id,
                    },
                    "selected-button"
                  )}
                  onClick={() => {
                    setActive(item.id);
                    onSelect(item);
                  }}
                />
              ),
            };
          })}
        />
      )}
    </div>
  );
};
