import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import { setErrorCode, setUser } from "@/store/actions";
import { SuccesToast } from "@/utils/alert";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import Cookies from "js-cookie";

const PrivacyConfirmModal = () => {
  const privacyDivRef = useRef(null);
  const [policy, setPolicy] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [policyVersion, setPolicyVersion] = useState("");
  const [acceptButtonDisabled, setAcceptButtonDisabled] = useState(true);
  const loggedUser = useSelector((state) => state.loggedUser);
  const isMobile = useSelector((state) => state.setMobile);
  const user = useSelector((state) => state.user);
  const errorCode = useSelector((state) => state.errorCode);
  const pathname = usePathname();
  const dispatch = useDispatch();

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
    apiServices
      .put(apiUrl.USER, body)
      .then(() => {
        setIsLoading(false);

        const newUser = { ...user };
        newUser.policies_version = policyVersion;
        dispatch(setUser(newUser));
        dispatch(setErrorCode(errorCode === 1007 ? 1008 : null));
        SuccesToast({ message: "Privacy Policy Updated Successfully" });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getPolicy();
  }, []);

  return (
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
              New Privacy Policy
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
            text={isLoading ? <Loader /> : "Accept Changes"}
          />
        </div>
      </div>
    </div>
  );
};

export default PrivacyConfirmModal;
