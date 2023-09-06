import { useState } from "react";
import { images } from "../../utils/imagesConstant";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";
import Image from "next/image";

export const ModalOnMobile = ({
  data,
  selectedLimit,
  handleToggle,
  handleSelect,
  handleSubmit,
  btnTitle,
  loading
}) => {
  const [limit, setLimit] = useState(selectedLimit);

  const shouldSubmit = !!handleSubmit;

  const onSubmit = () => {
    if (shouldSubmit) {
      return handleSubmit()
    }
    
    return handleSelect(limit)
  }

  const onSelect = (value) => {
    if (!!handleSubmit) {
      return handleSelect(value)
    }
    
    setLimit(value)
  }

  const activeItem = shouldSubmit ? selectedLimit : limit;

  return (
    <div
      className="modal show depositModal"
      id="limitModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: "block", padding: "0" }}
    >
      <div
        className="modal-dialog"
        style={{top:"40%"}}
      >
        <div className="modal-content">
        <div className="d-flex justify-content-center periodLine"></div>
          <p className="d-flex justify-content-center depositModalLimit">
            {data.title}
          </p>
          <Image
            src={images.closeIcon}
            className="closeIconSus"
            alt="Close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              handleToggle()
            }}
          />
          <div className="periodList">
          {data.data.map((value, index) => {
            return (
              <div
                key={index}
                data-id={index}
                className={
                  activeItem === value.value
                    ? "selectDecimal selectedOdd d-flex mb-3"
                    : "selectDecimal d-flex mb-3"
                }
                onClick={() => {
                  onSelect(value.value)
                }}
                style={{ maxHeight: "48px", margin: "10px 14px" }}
              >
                <div className="selectDecimal">
                  <p className="limitText">{value.name}</p>
                </div>
                {activeItem === value.value && (
                  <Image
                    src={images.validated}
                    alt="selected"
                    className="oddsSelected"
                  />
                )}
              </div>
            );
          })}
          </div>
          <div className="modal-footer limit d-flex justify-content-center w-100">
            <Button
              type="button"
              className={
                selectedLimit !== 0
                  ? "btn btnPrimary finishBtn2 setLimitBtn2 col-8"
                  : "btn finishBtn setLimitBtn col-8 disabled"
              }
              onClick={() => selectedLimit !== 0 && onSubmit()}
              text={<>{loading ? <Loader /> : btnTitle}</>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
