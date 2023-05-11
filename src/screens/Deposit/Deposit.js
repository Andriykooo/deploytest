import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import { Loader } from "../../components/loaders/Loader";
import ProfileMenu from "../../components/profileMenu/ProfileMenu";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";

const Deposit = () => {
  const [paymentUrl, setPaymentUrl] = useState("");
  const [getLinkLoading, setGetLinkLoading] = useState(false);
  const navigate = useNavigate();

  const handleGatewayLink = () => {
    setGetLinkLoading(true);
    apiServices
      .get(apiUrl.NEXT_PUBLIC_GET_PAYMENT_GATEWAY_LINK)
      .then((data) => {
        if (data?.url) {
          setPaymentUrl(data?.url);
        }
        setTimeout(() => setGetLinkLoading(false), 600);
      })
      .catch(() => {
        setGetLinkLoading(false);
      });
  };

  useEffect(() => {
    handleGatewayLink();
  }, []);

  return (
    <>
      <Header />
      <div className="contaiiner">
        <div className="row backgroundLinear ">
          <div className="d-none d-lg-block col-lg-3">
            <ProfileMenu sideBarMenu active={"active"} page="deposit" />
          </div>
          <div className="depositLimit">
            <div className="contentPosition secondContentPosition">
              <div className="pageContent">
                <div className="d-flex d-lg-none">
                  <div className="d-flex ">
                    <img
                      src={images.goBackArrow}
                      alt="Go back"
                      className="goBackArrow ms-0 "
                      onClick={() => navigate("/profile")}
                    />
                  </div>
                </div>
              </div>
            </div>
            {!getLinkLoading ? (
              <iframe
                src={paymentUrl}
                height="80%"
                width="100%"
                title="Gateway Iframe"
                className="gateway-iframe"
              ></iframe>
            ) : (
              <div className="depositLoader">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Deposit;
