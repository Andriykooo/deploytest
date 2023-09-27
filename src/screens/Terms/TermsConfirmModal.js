import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import { setTermsModal, setUser } from "@/store/actions";
import { SuccesToast } from "@/utils/alert";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import Cookies from "js-cookie";
import { useClientTranslation } from "@/app/i18n/client";

const TermsConfirmModal = () => {
  const { t } = useClientTranslation("terms");
  const dispatch = useDispatch();
  const pathname = usePathname();
  const termsDivRef = useRef(null);

  const [terms, setTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [termsVersion, setTermsVersion] = useState("");
  const [acceptButtonDisabled, setAcceptButtonDisabled] = useState(true);

  const user = useSelector((state) => state.user);
  const isMobile = useSelector((state) => state.setMobile);
  const loggedUser = useSelector((state) => state.loggedUser);
  const termsModal = useSelector((state) => state.termsModal);

  const handleScroll = () => {
    const termsDiv = termsDivRef.current;
    if (termsDiv.scrollTop + termsDiv.clientHeight >= termsDiv.scrollHeight) {
      setAcceptButtonDisabled(false);
    }
  };

  useEffect(() => {
    if (termsModal?.isOpen) {
      getTerms();
    }
  }, [termsModal]);

  const getTerms = () => {
    const language = Cookies.get("language") || "en";
    const country = loggedUser?.user_data?.country || "all";

    setIsLoading(true);
    apiServices
      .get(apiUrl.TERMS, { country, language })
      .then((res) => {
        setIsLoading(false);
        setTerms(res.content);
        setTermsVersion(res.version);
        handleScroll();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const putConfirmTerms = () => {
    const body = {
      user: {
        terms_conditions_version: termsVersion,
      },
    };
    setIsLoading(true);
    apiServices.put(apiUrl.USER, body).then(() => {
      setIsLoading(false);
      const newUser = { ...user };
      newUser.terms_conditions_version = termsVersion;
      dispatch(setUser(newUser));
      SuccesToast({ message: t("terms_conditions_update_success") });
      termsModal.callback().then(() => {
        dispatch(setTermsModal({ isOpen: false, callback: () => {} }));
        setIsLoading(false);
      });
    });
  };

  return termsModal?.isOpen ? (
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
          <p className="termsTitleForMainPage privacyModalTitle">
            {t("new_terms_conditions")}
          </p>
          <div
            ref={termsDivRef}
            className={
              !loggedUser && pathname.indexOf("/privacy") > "-1"
                ? "termsContent termsContent-height-50"
                : "termsContent termsContent-height-60 privacyContentModal"
            }
            onScroll={handleScroll}
            dangerouslySetInnerHTML={{ __html: terms }}
          ></div>
          <Button
            className={
              acceptButtonDisabled
                ? "acceptBtn disabled"
                : "btnPrimary acceptBtn"
            }
            onClick={() => {
              putConfirmTerms();
            }}
            disabled={acceptButtonDisabled}
            text={isLoading ? <Loader /> : t("accept_changes")}
          />
        </div>
      </div>
    </div>
  ) : null;
};

export default TermsConfirmModal;
