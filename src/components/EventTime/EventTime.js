import { useTranslations } from "@/hooks/useTranslations";
import { images } from "@/utils/imagesConstant";
import classNames from "classnames";
import moment from "moment";
import Image from "next/image";
import { useSelector } from "react-redux";
import { phaseStatus } from "@/utils/constants";
import "./EventTime.css";

export const EventTime = ({ data }) => {
  const t = useTranslations("common");
  const updatedEvents = useSelector((state) => state.updatedEvents);
  const updatedEvent = updatedEvents?.[data.event_id]?.data;
  const isResulted =
    updatedEvent?.current_status === phaseStatus.FINISHED || data.resulted;

  return (
    <div
      className={classNames("eventTime", {
        whiteTxt:
          updatedEvent?.current_status === phaseStatus.IN_PLAY ||
          data?.event_status === phaseStatus.IN_PLAY ||
          isResulted,
      })}
    >
      {isResulted ? (
        <Image
          className="eventTimePointer"
          alt={t("pointer_img")}
          src={images.pointer}
          height={13}
          width={13}
        />
      ) : null}
      <span>
        {data?.event_start_time &&
          moment(data.event_start_time).format("HH:mm")}
      </span>
    </div>
  );
};
