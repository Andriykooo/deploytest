import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/button/Button";
import { Loader } from "@/components/loaders/Loader";
import { setUser } from "@/store/actions";
import { SuccesToast } from "@/utils/alert";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { removeLocalStorageItem } from "@/utils/localStorage";

const PrivacyConfirmModal = ({ privacyShowModal, setPrivacyShowModal }) => {
  const privacyDivRef = useRef(null);
  const [policy, setPolicy] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [policyVersion, setPolicyVersion] = useState("");
  const [acceptButtonDisabled, setAcceptButtonDisabled] = useState(true);
  const loggedUser = useSelector((state) => state.loggedUser);
  const isMobile = useSelector((state) => state.setMobile);
  const user = useSelector((state) => state.user);
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    getPolicy();
  }, []);

  const handlePrivacyCloseModal = () => {
    setPrivacyShowModal(false);
  };

  const getPolicy = () => {
    const country = loggedUser.user_data.country || "US";
    setIsLoading(true);
    apiServices
      .get(`${apiUrl.PRIVACY}?country=${country}`)
      .then((response) => {
        setIsLoading(false);
        setPolicy(response.content);
        setPolicyVersion(response.version);
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
        handlePrivacyCloseModal();
        removeLocalStorageItem("privacyPolicyChanged");
        SuccesToast({ message: "Privacy Policy Updated Successfully" });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleScroll = () => {
    const privacyDiv = privacyDivRef.current;
    if (
      privacyDiv.scrollTop + privacyDiv.clientHeight >=
      privacyDiv.scrollHeight
    ) {
      setAcceptButtonDisabled(false);
    }
  };

  return (
    <>
      {privacyShowModal ? (
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
            <div className="modal-content modalCenterContent privacy-modalContent">
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
      ) : null}
    </>
  );
};

export default PrivacyConfirmModal;
