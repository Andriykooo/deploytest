import { useClientTranslation } from "@/app/i18n/client";
import { images } from "@/utils/imagesConstant";
import classNames from "classnames";
import moment from "moment";
import Image from "next/image";
import { useSelector } from "react-redux";

export const EventTime = ({ data }) => {
  const { t } = useClientTranslation("common");
  const currentTime = useSelector((state) => state.currentTime);
  const resultedEvents = useSelector((state) => state.resultedEvents);
  const isResulted = resultedEvents?.includes(data.event_id) || data.resulted;

  return (
    <div
      className={classNames("px-3", {
        whiteTxt:
          moment(data.event_start_time).isBefore(currentTime) || isResulted,
      })}
    >
      {isResulted ? (
        <Image alt={t("pointer_img")} src={images.pointer} height={13} width={13} />
      ) : null}
      {data?.event_start_time && moment(data.event_start_time).format("HH:mm")}
    </div>
  );
};
