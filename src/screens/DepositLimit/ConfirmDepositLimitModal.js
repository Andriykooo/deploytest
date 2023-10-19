"use client";

import { useRouter } from "next/navigation";
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
import { getUserApi } from "@/utils/apiQueries";

const ConfirmDepositLimitModal = ({ showConfirm, setShowConfirm }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.loggedUser);
  const isMobile = useSelector((state) => state.setMobile);
  const settings = useSelector((state) => state.settings);

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

    let body = {
      action_id,
      action,
    };
    apiServices
      .post(apiUrl.RECONFIRM_DEPOSIT, body)
      .then(() => {
        let newUser = {
          ...user,
          user_data: {
            ...user.user_data,
            actions: user.user_data.actions.filter(
              (row) => row.id !== action_id
            ),
          },
        };
        getUserApi(dispatch).then((response) => {
          newUser.user_data = response;
          if (action === "accept") {
            SuccesToast({
              message: "Deposit Limit - Accepted!",
            });
            setShowConfirm(false);
          } else if (action === "decline") {
            SuccesToast({
              message: "Deposit Limit - Declined!",
            });
            setShowConfirm(false);
          }
          dispatch(setLoggedUser(newUser));
        });

        setSelectedActionId(null);
        setIsLoadingAccept(false);
        setIsLoadingDecline(false);
      })
      .catch(() => {
        setIsLoadingAccept(false);
        setIsLoadingDecline(false);
      });
  };

  return (
    showConfirm && (
      <div
        className={isMobile ? "modal show modalFullScreen" : "modal"}
        id="alertGamingReminderModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <div
          className={
            isMobile
              ? "modal-dialog modal-fullscreen"
              : "modal-dialog privacyModal top-50 depositModal-dialog"
          }
        >
          <div className="modal-content modalCenterContent confirm-modalContent">
            <div className="confirmDepositLimit max-width-confirmContainer">
              {user.user_data.actions.map((row, index) => (
                <div className="confirmContainer" key={index}>
                  <Image
                    className="confirmImg"
                    src={images.confirmIcon}
                    alt={images.confirmIcon}
                  />
                  <div className="confirmTextContainer">
                    <p className="confirmHeader">{row.title}</p>
                    <p className="secondHeader">{row.description}</p>
                  </div>
                  <div className="confirmButtonsContainer">
                    <Button
                      type="button"
                      className="confirmFirstButton"
                      text={
                        row.old_value ===
                        `-1 ${
                          user?.user_data?.currency?.abbreviation ||
                          settings?.defaultCurrency
                        }`
                          ? "No Limit"
                          : row.old_value
                      }
                    />
                    <Image
                      className="confirmArrows"
                      src={images.confirmArrows}
                      alt={images.confirmArrows}
                    />
                    <Button
                      type="button"
                      className="confirmSecondButton"
                      text={
                        row.new_value ===
                        `-1 ${
                          user?.user_data?.currency?.abbreviation ||
                          settings?.defaultCurrency
                        }`
                          ? "No Limit"
                          : row.new_value
                      }
                    />
                  </div>
                  <div className="confirmDepositButtons">
                    <Button
                      type="button"
                      className="confirmFirstDepositButton"
                      onClick={() => handleAction(row.id, "decline")}
                      text={
                        isLoadingDecline && selectedActionId === row.id ? (
                          <Loader />
                        ) : (
                          "Decline"
                        )
                      }
                    />
                    <Button
                      type="button"
                      className="confirmSecondDepositButton"
                      onClick={() => handleAction(row.id, "accept")}
                      text={
                        isLoadingAccept && selectedActionId === row.id ? (
                          <Loader />
                        ) : (
                          "Accept"
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ConfirmDepositLimitModal;
