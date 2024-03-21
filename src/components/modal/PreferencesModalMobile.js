import { useState } from "react";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";
import Image from "next/image";
import classNames from "classnames";
import "../../components/Game/GameInfoMoadlMobile.css";
import { CloseIcon } from "@/utils/icons";

export const PreferencesModalMobile = ({
  data,
  selectedLimit,
  handleToggle,
  handleSelect,
  handleSubmit,
  btnTitle,
  loading,
}) => {
  const [limit, setLimit] = useState(selectedLimit);

  const shouldSubmit = !!handleSubmit;

  const onSubmit = () => {
    if (shouldSubmit) {
      return handleSubmit();
    }

    return handleSelect(limit);
  };

  const onSelect = (value) => {
    if (handleSubmit) {
      return handleSelect(value);
    }

    setLimit(value);
  };

  const activeItem = shouldSubmit ? selectedLimit : limit;

  return (
    <div
      className="modal show depositModal preferencesModalMobile"
      id="limitModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: "block", padding: "0" }}
    >
      <div className="modal-dialog preferencesModalMobileDialog">
        <div className="modal-content rounded-bottom-0 pb-4">
          <div className="d-flex justify-content-center periodLine mt-3"></div>
          <div className="modal-head px-4">
            <h2>
              {data.title}
            </h2>
            <CloseIcon onClick={() => handleToggle()} />
          </div>
          <div className="dashed-img-div p-0">
            <Image alt="line" src={images.dashedLine} fill />
          </div>
          <div className="preferencesModalMobile-list profileModal">
            {data?.data?.map((value, index) => {
              return (
                <div
                  key={index}
                  data-id={index}
                  className={classNames(
                    "preferencesModalMobile-item selectDecimal d-flex",
                    {
                      selectedOdd: activeItem === value.value,
                    }
                  )}
                  onClick={() => {
                    onSelect(value.value);
                  }}
                >
                  <p className="limitText">{value.name}</p>
                </div>
              );
            })}
          </div>
          <div className="preferencesModalBtn">
            <Button
              type="button"
              className={classNames("setLimitBtn", {
                disable: selectedLimit === 0,
              })}
              onClick={() => selectedLimit !== 0 && onSubmit()}
              text={<>{loading ? <Loader /> : btnTitle}</>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
