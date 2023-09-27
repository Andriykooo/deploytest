import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import { setPrivacytModal, setUser } from "@/store/actions";
import { SuccesToast } from "@/utils/alert";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import Cookies from "js-cookie";
import { useClientTranslation } from "@/app/i18n/client";

const PrivacyConfirmModal = () => {
  const { t } = useClientTranslation("privacy");
  const dispatch = useDispatch();
  const pathname = usePathname();

  const privacyDivRef = useRef(null);

  const loggedUser = useSelector((state) => state.loggedUser);
  const isMobile = useSelector((state) => state.setMobile);
  const user = useSelector((state) => state.user);
  const privacyModal = useSelector((state) => state.privacyModal);

  const [policy, setPolicy] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [policyVersion, setPolicyVersion] = useState("");
  const [acceptButtonDisabled, setAcceptButtonDisabled] = useState(true);

  const handleScroll = () => {
    const privacyDiv = privacyDivRef.current;
    if (
      privacyDiv.scrollTop + privacyDiv.clientHeight >=
      privacyDiv.scrollHeight
    ) {
      setAcceptButtonDisabled(false);
    }
  };

  const getPolicy = () => {
    const language = Cookies.get("language") || "en";
    const country = loggedUser?.user_data?.country || "all";
    setIsLoading(true);

    apiServices
      .get(apiUrl.PRIVACY, { country, language })
      .then((response) => {
        setIsLoading(false);
        setPolicy(response.content);
        setPolicyVersion(response.version);
        handleScroll();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const putConfirmPolicy = () => {
    const body = {
      user: {
        policies_version: policyVersion,
      },
    };
    setIsLoading(true);
    apiServices.put(apiUrl.USER, body).then(() => {
      setIsLoading(false);
      const newUser = { ...user };
      newUser.policies_version = policyVersion;
      dispatch(setUser(newUser));
      SuccesToast({ message: t("privacy_policy_update_success") });
      privacyModal.callback().then(() => {
        dispatch(setPrivacytModal({ isOpen: false, callback: () => {} }));
        setIsLoading(false);
      });
    });
  };

  useEffect(() => {
    if (privacyModal?.isOpen) {
      getPolicy();
    }
  }, [privacyModal]);

  return privacyModal?.isOpen ? (
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
            : "modal-dialog privacyModal top-50"
        }
      >
        <div className="modal-content modalCenterContent terms-modalContent">
          <div>
            <p className="termsTitleForMainPage privacyModalTitle">
              {t("new_privacy_policy")}
            </p>
            <div
              ref={privacyDivRef}
              className={
                !loggedUser && pathname.indexOf("/privacy") > "-1"
                  ? "termsContent termsContent-height-50"
                  : "termsContent termsContent-height-60 privacyContentModal"
              }
              onScroll={handleScroll}
              dangerouslySetInnerHTML={{ __html: policy }}
            ></div>
          </div>
          <Button
            className={
              acceptButtonDisabled
                ? "acceptBtn disabled"
                : "btnPrimary acceptBtn"
            }
            onClick={() => {
              putConfirmPolicy();
            }}
            disabled={acceptButtonDisabled}
            text={isLoading ? <Loader /> : t("accept_changes")}
          />
        </div>
      </div>
    </div>
  ) : null;
};

export default PrivacyConfirmModal;
