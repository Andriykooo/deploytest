import moment from "moment";
import { ArrowIcon } from "../../utils/icons";
import { MatchOdds } from "../matches/MatchOdds";
import { useTranslations } from "next-intl";
import { Runner } from "../Runner/Runner";
import Image from "next/image";
import { CustomLink } from "../Link/Link";
import "../eventTable/EventTable.css";

export const RacingItem = ({ data, slug }) => {
  const t = useTranslations();

  const day =
    moment().day() === moment(data.event_start_time).day()
      ? "today"
      : "tomorrow";

  return (
    <div>
      <div className="horse-links">
        <div className="racingLink">
          {/* todo: add live streaming link */}
          {/* <Image src={images.streamVideo} alt="#" className="racingHeaderImg" /> */}
          <span className="racingHeaderName">
            <span className="racingHeaderNameVenue">{t(`common.${day}`)}</span>{" "}
            {moment(data.event_start_time).format("HH:mm")} {data.event_venue}
          </span>
        </div>
        <div className="racingUnderTitle">{data.event_description}</div>
      </div>
      <div className="events-contents-container horseEvents">
        {(data.selections.length > 6
          ? data.selections?.slice(0, 6)
          : [...data.selections].concat(
              new Array(6 - data.selections.length).fill("")
            )
        )?.map((selection, index) => {
          const isSuspended = selection.trading_status === "suspended";

          return (
            <div
              className="events-row-container"
              key={selection?.bet_id || index}
            >
              <div className="horse-container">
                <div className="silk-image">
                  {selection.silk_image && (
                    <Image
                      src={selection.silk_image}
                      alt="slik"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                      height={20}
                      width={20}
                    />
                  )}
                </div>
                <Runner
                  data={selection}
                  slug={slug}
                  className="racing-item-runner"
                />
                {selection && (
                  <div className="odds-of-horse">
                    <MatchOdds
                      selection={{
                        ...selection,
                        trading_status: "open",
                        odds_decimal: selection.odds_decimal,
                        odds_fractional: selection.odds_fractional,
                      }}
                      disable={isSuspended}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <CustomLink
          href={`/racecard/${slug}/${data.event_venue.toLowerCase()}?id=${
            data.event_id
          }&filter=${day}`}
        >
          <span className="more-container-in-horse">
            <span className="more-sidebar-in-events">
              {t("sports.view_racecard")}
            </span>
            <ArrowIcon className="more-container-arrow" />
          </span>
        </CustomLink>
      </div>
    </div>
  );
};
