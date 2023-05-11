import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/button/Button";
import { Loader } from "../../components/loaders/Loader";
import { setUser } from "../../store/actions";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";

const TermsConfirmModal = ({ termsShowModal, setTermsShowModal }) => {
  const termsDivRef = useRef(null);
  const [terms, setTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [termsVersion, setTermsVersion] = useState("");
  const [acceptButtonDisabled, setAcceptButtonDisabled] = useState(true);
  const user = useSelector((state) => state.user);
  const isMobile = useSelector((state) => state.setMobile);
  const loggedUser = useSelector((state) => state.loggedUser);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleScroll = () => {
    const termsDiv = termsDivRef.current;
    if (termsDiv.scrollTop + termsDiv.clientHeight >= termsDiv.scrollHeight) {
      setAcceptButtonDisabled(false);
    }
  };

  useEffect(() => {
    getTerms();
  }, []);

  const handleCloseTermsModal = () => {
    setTermsShowModal(false);
  };

  const getTerms = () => {
    const country = loggedUser.user_data.country || "US";
    setIsLoading(true);
    apiServices
      .get(`${apiUrl.TERMS}?country=${country}`)
      .then((res) => {
        setIsLoading(false);
        setTerms(res.content);
        setTermsVersion(res.version);
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
    apiServices
      .put(apiUrl.PUT_PRIVACY, body)
      .then(() => {
        setIsLoading(false);

        const newUser = { ...user };
        newUser.terms_conditions_version = termsVersion;

        dispatch(setUser(newUser));
        handleCloseTermsModal();
        localStorage.removeItem("termsConditionsChanged");
        SuccesToast({ message: "Terms and Conditions Updated Successfully" });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {termsShowModal ? (
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
                : "modal-dialog privacyModal"
            }
          >
            <div className="modal-content modalCenterContent terms-modalContent">
              <p className="termsTitleForMainPage privacyModalTitle">
                New Terms And Conditions
              </p>
              <div
                ref={termsDivRef}
                className={
                  !loggedUser && router.pathname.indexOf("/privacy") > "-1"
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
                text={isLoading ? <Loader /> : "Accept Changes"}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TermsConfirmModal;
