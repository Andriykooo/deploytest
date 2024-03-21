import { CloseIcon } from "@/utils/icons";
import "./HeaderNotification.css";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { addLocalStorageItem, getLocalStorageItem } from "@/utils/localStorage";
import { setHeaderNotification } from "@/store/actions";
import { DynamicSelections } from "@/components/dynamicSelections/DynamicSelections";
import { LinkType } from "@/components/LinkType/LinkType";

const HeaderNotification = ({ data, active }) => {
  const dispatch = useDispatch();
  const headerNotification = useSelector((state) => state.headerNotification);

  const changeNotifications = () => {
    const removedNotifications = JSON.parse(
      getLocalStorageItem("removed_notifications") || "[]"
    );
    const newRemovedNotification = {
      id: data.id,
      modified_at: data.modified_at,
    };
    const indexToUpdate = removedNotifications.findIndex(
      (notification) => notification.id === newRemovedNotification.id
    );

    if (indexToUpdate !== -1) {
      removedNotifications[indexToUpdate] = newRemovedNotification;
    } else {
      removedNotifications.push(newRemovedNotification);
    }
    addLocalStorageItem(
      "removed_notifications",
      JSON.stringify(removedNotifications)
    );
    dispatch(
      setHeaderNotification({
        data: headerNotification.data,
        activeNotification: null,
      })
    );
  };

  return (
    <div className={classNames("header-notification", { active: active })}>
      <div className="notification-left-wrapper">
      <p
        className="notification-text"
      >
        {data.title}
      </p>
      {data?.promo_type === "dynamic" && data?.button?.name && (
          <DynamicSelections
            selections={data?.button?.selections}
            eventId={data?.button?.event_id}
            sportSlug={data?.button?.sport_slug}
          />
        )}
        {data?.promo_type === "default" && data?.button?.name && (
          <LinkType
            className="notification-button"
            path={data.button.link}
            openType={data?.open_type}
            type={data.link_type}
            modalData={{
              slug: data?.button?.link?.substring(1),
              title: data?.title,
            }}
          >
            {data?.button?.name}
          </LinkType>
        )}
      </div>
        <div className="close-header-notification">
          <CloseIcon width={16} height={16} onClick={changeNotifications} />
        </div>
    </div>
  );
};

export default HeaderNotification;
