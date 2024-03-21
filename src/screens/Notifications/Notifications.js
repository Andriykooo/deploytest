"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../../store/actions";
import { SuccesToast, alertToast } from "../../utils/alert";
import { emailNotifications, pushNotifications } from "../../utils/constants";
import { ToggleLabel } from "../../components/ToggleLabel/ToggleLabel";
import PreferencesTitle from "@/components/preferencesTitle/PreferencesTitle";
import { setSettingsApi } from "@/utils/apiQueries";
import { useTranslations } from "next-intl";
import "../Withdraw/Withdraw.css";
import "../Notifications/Notifications.css";

const Notifications = () => {
  const t = useTranslations();
  const dispatch = useDispatch();

  const [pushNotificationSettings, setPushNotificationSettings] = useState([]);
  const [emailNotificationSettings, setEmailNotificationSettings] = useState(
    []
  );
  const isMobile = useSelector((state) => state.setMobile);
  const loggedUser = useSelector((state) => state.loggedUser);

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

  const onToggle = async (key, type) => {
    let newUser = {};
    let currValue = false;
    Object.assign(newUser, loggedUser);

    if (Notification.permission === "denied") {
      alertToast({
        message: t("notifications.enable_notifications"),
      });

      return;
    }

    if (Notification.permission === "default") {
      const premission = await Notification.requestPermission();

      if (premission !== "granted") {
        return;
      }
    }

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
    setSettingsApi(body, dispatch, {
      onSuccess: (result) => {
        if (Object.keys(result).length < 1) {
          SuccesToast(t("notifications.notification_turned_off_success"));
        }
      },
      onError: (error) =>
        alertToast(
          error?.message || t("notifications.settings_save_error_message")
        ),
    });
  };
  return (
    <div className="depositLimit">
      <div className="depositBody">
        <PreferencesTitle
          title={t("common.notifications")}
          marginBottomSize="lg"
        />
        <div className="row depositLimitContainer">
          <span className="notificationsSub ">
            {t("notifications.push_notifications")}
          </span>
          {pushNotificationSettings.map((item) => (
            <ToggleLabel
              notification={{ ...item, text: t(`notifications.${item.text}`) }}
              key={item.key}
              type="push"
              className="notificationTrack"
              value={item.status}
              onToggle={onToggle}
              isMobile={isMobile}
            />
          ))}
        </div>
        <div className="divider" />
        <div className="row depositLimitContainer">
          <span className="notificationsSub ">
            {t("notifications.email_notifications")}
          </span>

          {emailNotificationSettings.map((item) => (
            <ToggleLabel
              notification={{ ...item, text: t(`notifications.${item.text}`) }}
              key={item.key}
              type="email"
              value={item.status}
              onToggle={onToggle}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
