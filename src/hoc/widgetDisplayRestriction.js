import moment from "moment";
import { memo } from "react";
import { useSelector } from "react-redux";

export const widgetDisplayRestriction = (WrappedComponent) => {
  const MemoizedWrappedComponent = memo(WrappedComponent);

  return function WidgetDisplayRestriction(props) {
    const currentTime = useSelector((state) => state.currentTime);
    const time = moment(currentTime);
    const widgetEndDate = moment(props?.data?.publish_stop_date_time);

    const displayComponent =
      props?.data?.publish_stop_date_time && !props?.data?.never_expire
        ? time.isBefore(widgetEndDate)
        : true;

    return displayComponent ? <MemoizedWrappedComponent {...props} /> : null;
  };
};
