"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header/Header";
import ProfileMenu from "../../components/profileMenu/ProfileMenu";
import { setLoggedUser } from "../../store/actions";
import { SuccesToast, alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import {
  apiUrl,
  emailNotifications,
  pushNotifications,
} from "../../utils/constants";
import { images } from "../../utils/imagesConstant";
import "../Notifications/Notifications.css";
import "../Withdraw/Withdraw.css";
import { ToggleLabel } from "./ToggleLabel";

const Notifications = () => {
  const dispatch = useDispatch();

  const [pushNotificationSettings, setPushNotificationSettings] = useState([]);
  const [emailNotificationSettings, setEmailNotificationSettings] = useState(
    []
  );
  const isMobile = useSelector((state) => state.setMobile);
  const loggedUser = useSelector((state) => state.loggedUser);

  let active = "active";

  useEffect(() => {
    const localPushNotifications = [...pushNotifications];
    const localEmailNotifications = [...emailNotifications];
    if (loggedUser) {
      const { push_notification, email_notification } =
        loggedUser.user_data.settings;
      localPushNotifications.map((item) => {
        return (item["status"] = push_notification[item.key]);
      });
      localEmailNotifications.map((item) => {
        return (item["status"] = email_notification[item.key]);
      });
      setPushNotificationSettings(localPushNotifications);
      setEmailNotificationSettings(localEmailNotifications);
    }
  }, [loggedUser]);

  const onToggle = (key, type) => {
    let newUser = {};
    let currValue = false;
    Object.assign(newUser, loggedUser);
    switch (type) {
      case "email":
        newUser.user_data.settings.email_notification[key] =
          !newUser.user_data.settings.email_notification[key];
        currValue = newUser.user_data.settings.email_notification[key];
        break;
      case "push":
        newUser.user_data.settings.push_notification[key] =
          !newUser.user_data.settings.push_notification[key];
        currValue = newUser.user_data.settings.push_notification[key];
        break;
      default:
        return;
    }
    dispatch(setLoggedUser(newUser));
    handleUpdate(key, currValue, newUser);
  };

  const handleUpdate = (key, currValue) => {
    let body = {};
    body[key] = currValue;
    apiServices
      .put(`${apiUrl.SETTINGS}`, body)
      .then((result) => {
        if (Object.keys(result).length < 1) {
          SuccesToast("Notification turned off successfully!");
        }
      })
      .catch((error) =>
        alertToast(
          error?.message || "Error saving your settings, please try again"
        )
      );
  };
  const router = useRouter();
  return (
    <>
      <Header />
      <div className=" backgroundLinear ">
        <div className="d-none d-lg-block ">
          <ProfileMenu sideBarMenu page="notifications" active={active} />
        </div>
        <div className="depositLimit">
          <div className={isMobile ? "p-4 pt-0" : "depositBody"}>
            <div className="d-flex d-lg-none">
              <div className="d-flex ">
                <Image
                  src={images.goBackArrow}
                  alt="Go back"
                  className="goBackArrow ms-0 mb-3"
                  onClick={() => router.push("/profile")}
                />
              </div>
            </div>
            <p className="menuTitle">Notifications </p>
            <div className="row depositLimitContainer">
              <span className="notificationsSub ">Push Notifications</span>
              {pushNotificationSettings.map((item, i) => (
                <ToggleLabel
                  notification={item}
                  key={item.key}
                  type="push"
                  className="notificationTrack"
                  value={item.status}
                  onToggle={onToggle}
                  isMobile={isMobile}
                  last={i + 1 === pushNotificationSettings?.length}
                />
              ))}
            </div>
            <div className="divider" />
            <div className="row depositLimitContainer">
              <span className="notificationsSub ">Email Notifications</span>

              {emailNotificationSettings.map((item, i) => (
                <ToggleLabel
                  notification={item}
                  key={item.key}
                  type={"email"}
                  value={item.status}
                  onToggle={onToggle}
                  isMobile={isMobile}
                  first={i === 0}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
