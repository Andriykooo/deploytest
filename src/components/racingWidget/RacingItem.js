import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowIcon } from "../../utils/icons";
import { MatchOdds } from "../matches/MatchOdds";
import { capitalize } from "@mui/material";

export const RacingItem = ({ data }) => {
  const params = useParams();

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
            {capitalize(day)}, {moment(data.event_start_time).format("HH:mm")}{" "}
            {data.event_venue}
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
          if (selection?.odd) {
            selection.odd = selection?.odds;
          }

          return (
            <div className="events-row-container" key={selection?.bet_id || index}>
              <div className="events-small-container">
                <div className="horse-container">
                  <div className="silk-image">
                    {selection.silk_image && (
                      <Image
                        src={selection.silk_image}
                        alt="silk"
                        loading="lazy"
                        quality={50}
                        height={14}
                        width={18}
                      />
                    )}
                  </div>
                  <div className="text-of-horse">
                    <div>
                      <div className="selection-name">{selection.name}</div>
                      <div className="selection-description">
                        {selection.description}
                      </div>
                    </div>
                  </div>
                  {selection && (
                    <div className="odds-of-horse">
                      <MatchOdds selection={selection} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <Link
          href={`/racecard/${
            params.slug
          }/${data.event_venue.toLowerCase()}?id=${
            data.event_id
          }?filter=${day}`}
        >
          <span className="more-container-in-horse">
            <span className="more-sidebar-in-events">View Racecard</span>
            <ArrowIcon className="more-container-arrow" />
          </span>
        </Link>
      </div>
    </div>
  );
};
