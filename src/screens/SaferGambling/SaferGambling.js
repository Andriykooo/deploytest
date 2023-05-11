import { React, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import ProfileMenu from "../../components/profileMenu/ProfileMenu";
import { setUserSettings } from "../../store/actions";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import "../Profile/Profile.css";
import "../SaferGambling/SaferGambling.css";
import "../Withdraw/Withdraw.css";

const SaferGambling = () => {
  const dispatch = useDispatch();
  let active = "active";
  const navigate = useNavigate();

  useEffect(() => {
    apiServices.get(apiUrl.NEXT_PUBLIC_SETTING_OPTIONS).then((response) => {
      dispatch(setUserSettings(response));
    });
  }, []);
  const saferGambling = [
    {
      title: "Deposit Limits",
      link: "/deposit_limit",
      desc: "Set deposit limits to control your spending",
    },
    {
      title: "Gaming Reminders",
      link: "/reality_check",
      desc: "Control your game time with reminders",
    },
    {
      title: "Suspend Account",
      link: "/suspend_account",
      desc: "Take a break from Swifty Gaming",
    },
    {
      title: "Self Exclude",
      link: "/self_exclude",
      desc: "Excluded yourself from Swifty Gaming",
    },
    {
      title: "More information",
      link: "/safer_gambling_information",
      desc: "Read about Safer Gambling",
    },
  ];

  return (
    <>
      <Header />

      <div className="backgroundLinear">
        <div className="d-none d-lg-block">
          <ProfileMenu sideBarMenu page="safer_gambling" active={active} />
        </div>
        <div className="pageContent-safer">
          <div className="depositLimit">
            <div className="d-flex d-lg-none">
              <div className="d-flex ">
                <img
                  src={images.goBackArrow}
                  alt="Go back"
                  className="goBackArrow ms-0 mb-3"
                  onClick={() => navigate("/profile")}
                />
              </div>
            </div>

            <div>
              <p className="menuTitle">Safer Gambling </p>
            </div>
            <div className="row saferDivs">
              {saferGambling.map((row, index) => {
                return (
                  <div className="infoDiv mb-3" key={index}>
                    <Link to={row.link}>
                      <p className="saferTitle m-2">{row.title}</p>
                      <p className="saferMessage m-2 ">{row.desc}</p>
                      <img
                        alt="img-arrowIcon"
                        src={images.arrowIcon}
                        className="profileArrow"
                      />
                    </Link>
                  </div>
                );
              })}
              <div className="mb-3 yellowDiv d-flex">
                <img
                  src={images.whenTheFun}
                  alt="Safer Gambling"
                  className="m-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SaferGambling;
