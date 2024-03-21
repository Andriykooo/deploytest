import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/button/Button";
import { useTranslations } from "next-intl";
import { ReminderIcon } from "@/utils/icons";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { Loader } from "../loaders/Loader";

const FreeBetModal = ({ close }) => {
  const [freeBetContent, setFreeBetContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("common");
  const isMobile = useSelector((state) => state.setMobile);
  const getFreeBetContent = () => {
    setIsLoading(true);
    apiServices
      .get(`${apiUrl.PAGE_CONTENT}?type=free-bet-credits`)
      .then((response) => {
        setIsLoading(false);
        const content = response?.content;
        setFreeBetContent(content);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getFreeBetContent();
  }, []);

  return (
    <div
      className={isMobile ? "modal show modalFullScreen" : "modal center"}
      id="alertGamingReminderModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <div
        className={`freeBetModal-content ${
          isMobile ? "modal-dialog modal-fullscreen" : "modal-dialog"
        }`}
      >
        <div className="modal-content modalCenterContent profile-modal justify-content-between">
          {isLoading ? (
            <div className="loader">
              <Loader />
            </div>
          ) : (
            <>
              <div className="d-flex align-items-center flex-column overflow-hidden">
                <ReminderIcon className="gaming-reminder-logo" />

                <div className="text-container">
                  <div
                    dangerouslySetInnerHTML={{ __html: freeBetContent }}
                    className="free_bet_modal_content"
                  ></div>
                </div>
              </div>
              <div className="d-flex align-items-center flex-column w-100">
                <Button
                  text={t("close")}
                  onClick={close}
                  className={
                    "gaming-reminder-accept-button free-bet-close-button"
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeBetModal;
