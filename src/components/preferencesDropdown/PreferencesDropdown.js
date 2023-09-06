import React, { useRef } from "react";
import { Button } from "@/components/button/Button";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { images } from "@/utils/imagesConstant";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSelector } from "react-redux";
import { ModalOnMobile } from "../modal/ModalOnMobile";

const PreferencesDropdown = ({ handleToggle, handleSubmit, btnTitle, loader, placeholder, data, handleSelect, selectedItem, modalOnMobile, type = undefined }) => {
  const listRef = useRef(null);
  const isTablet = useSelector((state) => state.isTablet);

  useClickOutside(listRef, handleToggle)
  return (
    <div className="col-6 selectDepositDiv ">
      <Button
        type="button"
        className={"setLimit"}
        onClick={handleToggle}
        text={
          <>
            {loader ? (
              <div className="d-flex justify-content-between">
                <Skeleton
                  variant="rectangular"
                  className="my-2 depositSkeleton"
                  animation="wave"
                />
              </div>
            ) : (
              placeholder
            )}
            <Image
              src={images.arrowIcon}
              className="depositLimitArrow"
              alt="Click"
            />
          </>
        }
      />
      {(data.show && type === data.type) && (<div className={modalOnMobile && isTablet ? 'mobileDdWrapper' : "ddWrapper"} ref={listRef}>
        {modalOnMobile && isTablet ?
          <ModalOnMobile
            data={data}
            selectedLimit={selectedItem}
            handleSelect={handleSelect}
            handleToggle={handleToggle}
            handleSubmit={handleSubmit}
            loading={loader}
            btnTitle={btnTitle}
          />
          :
          data.data.map((value, index) => {
            return (
              <div
                key={index}
                data-id={index}
                className={
                  selectedItem === value.value
                    ? "selectDecimal selectedOdd d-flex w-100"
                    : "selectDecimal d-flex w-100"
                }
                onClick={() => {
                  handleToggle();
                  handleSelect(value.value);
                }}
              >
                <div className="selectDecimal">
                  <p className="mx-2 my-1 ddText">{value.name}</p>
                </div>
                {selectedItem === value.value && (
                  <Image
                    src={images.selected}
                    alt="selected"
                    className="oddsSelected"
                    style={{ top: "15%" }}
                  />
                )}
              </div>
            );
          })}
      </div>)}
    </div>
  );
};

export default PreferencesDropdown;
