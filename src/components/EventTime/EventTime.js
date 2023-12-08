import { useTranslations } from "next-intl";
import { images } from "@/utils/imagesConstant";
import classNames from "classnames";
import moment from "moment";
import Image from "next/image";
import { useSelector } from "react-redux";

export const EventTime = ({ data }) => {
  const t = useTranslations("common");
  const currentTime = useSelector((state) => state.currentTime);
  const resultedEvents = useSelector((state) => state.resultedEvents);
  const isResulted = resultedEvents[data.event_id] || data.resulted;

  return (
    <div
      className={classNames("px-3", {
        whiteTxt:
          moment(data.event_start_time).isBefore(currentTime) || isResulted,
      })}
    >
      {isResulted ? (
        <Image
          className="me-1"
          alt={t("pointer_img")}
          src={images.pointer}
          height={13}
          width={13}
        />
      ) : null}
      {data?.event_start_time && moment(data.event_start_time).format("HH:mm")}
    </div>
  );
};
