import React, { useRef } from "react";
import { Button } from "@/components/button/Button";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSelector } from "react-redux";
import { PreferencesModalMobile } from "../modal/PreferencesModalMobile";
import classNames from "classnames";
import { Skeleton } from "../Skeleton/Skeleton";
import "./PreferencesDropdown.css";
import "../../screens/Deposit/Deposit.css";
import { PreferencesDropdownItemIcon, ProfileArrowIcon } from "@/utils/icons";

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
  useClickOutside(listRef, handleToggle);

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
                <Skeleton className="my-2 depositSkeleton" />
              </div>
            ) : (
              placeholder
            )}
            <ProfileArrowIcon className="depositLimitArrow" />
          </>
        }
      />
      {data.show && type === data.type && (
        <div
          className={
            modalOnMobile && isTablet
              ? "mobileDdWrapper"
              : "preferencesDropdown-desktop ddWrapper"
          }
          ref={listRef}
        >
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
            data.data?.map((value, index) => {
              return (
                <div
                  key={index}
                  data-id={index}
                  className={classNames(
                    "preferencesDropdown-item selectDecimal d-flex w-100",
                    {
                      selectedOdd: selectedItem === value.value,
                    }
                  )}
                  onClick={() => {
                    handleToggle();
                    handleSelect(value.value);
                  }}
                >
                  <p className="ddText">{value.name}</p>
                  {selectedItem === value.value && (
                    <PreferencesDropdownItemIcon className="preferencesDropdown-item-icon" />
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
