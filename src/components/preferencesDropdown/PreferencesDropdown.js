import React, { useRef } from "react";
import { Button } from "@/components/button/Button";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { images } from "@/utils/imagesConstant";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSelector } from "react-redux";
import { PreferencesModalMobile } from "../modal/PreferencesModalMobile";
import classNames from "classnames";

import './PreferencesDropdown.css';

const PreferencesDropdown = ({
  handleToggle,
  handleSubmit,
  btnTitle,
  loader,
  placeholder,
  data,
  handleSelect,
  selectedItem,
  modalOnMobile,
  type = undefined,
}) => {
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
      {(data.show && type === data.type) && (
        <div className={modalOnMobile && isTablet ? 'mobileDdWrapper' : "preferencesDropdown-desktop ddWrapper"} ref={listRef}>
          {modalOnMobile && isTablet ? (
            <PreferencesModalMobile
              data={data}
              selectedLimit={selectedItem}
              handleSelect={handleSelect}
              handleToggle={handleToggle}
              handleSubmit={handleSubmit}
              loading={loader}
              btnTitle={btnTitle}
            />
          ) : (
            data.data.map((value, index) => {
              return (
                <div
                  key={index}
                  data-id={index}
                  className={classNames("preferencesDropdown-item selectDecimal d-flex w-100", {
                    selectedOdd: selectedItem === value.value
                  })}
                  onClick={() => {
                    handleToggle();
                    handleSelect(value.value);
                  }}
                >
                  <p className="ddText">{value.name}</p>
                  {selectedItem === value.value && (
                    <Image
                      src={images.checkIcon}
                      alt="selected"
                      className="preferencesDropdown-item-icon"
                      width={20}
                      height={20}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default PreferencesDropdown;
