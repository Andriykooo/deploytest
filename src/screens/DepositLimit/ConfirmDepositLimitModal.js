"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import { setLoggedUser } from "@/store/actions";
import { SuccesToast } from "@/utils/alert";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { images } from "@/utils/imagesConstant";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { formatNumberWithDecimal } from "@/utils/formatNumberWithDecimal";
import { getUserApi } from "@/utils/apiQueries";
import "./ConfirmDepositLimitModal.css";
import classNames from "classnames";

const ConfirmDepositLimitModal = ({ data }) => {
  const t = useTranslations();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.loggedUser);
  const isMobile = useSelector((state) => state.setMobile);

  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [isLoadingDecline, setIsLoadingDecline] = useState(false);

  const handleAction = (action_id, action) => {
    setSelectedActionId(action_id);
    if (action === "accept") {
      setIsLoadingAccept(true);
    } else if (action === "decline") {
      setIsLoadingDecline(true);
    }

    const body = {
      action_id,
      action,
    };

    apiServices
      .post(apiUrl.RECONFIRM_DEPOSIT, body)
      .then(() => {
        if (action === "accept") {
          SuccesToast({
            message: t("deposit.deposit_limit_accepted"),
          });
        } else if (action === "decline") {
          SuccesToast({
            message: t("deposit.deposit_limit_declined"),
          });
        }

        getUserApi(dispatch).then((response) => {
          setSelectedActionId(null);
          setIsLoadingAccept(false);
          setIsLoadingDecline(false);
          dispatch(setLoggedUser({ ...user, user_data: response }));
        });
      })
      .catch(() => {
        setIsLoadingAccept(false);
        setIsLoadingDecline(false);
      });
  };

  const [oldValue] = data.old_value.split(" ");
  const [newValue] = data.new_value.split(" ");

  return (
    <div
      className={classNames("modal show", { modalFullScreen: isMobile })}
      id="alertGamingReminderModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <div
        className={
          isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog  top-50"
        }
      >
        <div className="modal-content modalCenterContent">
          <div className="confirmDepositLimit max-width-confirmContainer">
            <div className="confirmContainer">
              <Image
                className="confirmImg"
                src={images.confirmIcon}
                alt={images.confirmIcon}
              />
              <div className="confirmTextContainer">
                <p className="confirmHeader">{data.title}</p>
                <p className="secondHeader">{data.description}</p>
              </div>
              <div className="confirmButtonsContainer">
                <Button
                  type="button"
                  className="confirmFirstButton"
                  text={
                    data.old_value.toLowerCase() === "no limit"
                      ? t("common.no_limit")
                      : `${formatNumberWithDecimal(oldValue)} ${
                          user?.user_data?.currency?.abbreviation
                        }`
                  }
                />
                <Image
                  className="confirmArrows"
                  src={images.confirmArrows}
                  alt={"arrow"}
                />
                <Button
                  type="button"
                  className="confirmSecondButton"
                  text={
                    data.new_value.toLowerCase() === "no limit"
                      ? t("common.no_limit")
                      : `${formatNumberWithDecimal(newValue)} ${
                          user?.user_data?.currency?.abbreviation
                        }`
                  }
                />
              </div>
            </div>
            <div className="confirmDepositButtons">
              <Button
                type="button"
                className="gaming-reminder-history-button"
                onClick={() => handleAction(data.id, "decline")}
                text={
                  isLoadingDecline && selectedActionId === data.id ? (
                    <Loader />
                  ) : (
                    t("deposit.decline")
                  )
                }
              />
              <Button
                type="button"
                className="gaming-reminder-accept-button"
                onClick={() => handleAction(data.id, "accept")}
                text={
                  isLoadingAccept && selectedActionId === data.id ? (
                    <Loader />
                  ) : (
                    t("common.accept")
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDepositLimitModal;
