import { setRaceCard } from "@/store/actions";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ArrowIcon } from "../../utils/icons";
import { images } from "../../utils/imagesConstant";
import { MatchOdds } from "../matches/MatchOdds";

export const RacingItem = ({ data }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const openRacecard = () => {
    router.push(`/racecard/${data.event_id}`);
    dispatch(setRaceCard(data));
  };

  return (
    <div>
      <div className="horse-links">
        <div className="racingLink">
          {/* todo: add live streaming link */}
          {/* <Image src={images.streamVideo} alt="#" className="racingHeaderImg" /> */}
          <span className="racingHeaderName">
            {moment(data.event_start_time).format("HH:mm")} {data.event_name}
          </span>
        </div>
        <div className="racingUnderTitle">{data.event_description}</div>
      </div>
      <div className="events-contents-container horseEvents">
        {data.selections?.slice(0, 5)?.map((selection) => {
          selection.odd = selection.odds;

          return (
            <div className="events-row-container" key={selection.bet_id}>
              <div className="events-small-container">
                <div className="horse-container">
                  <div className="silk-image">
                    <Image
                      src={images.silkImage}
                      alt="silk"
                      height={14}
                      width={18}
                    />
                  </div>
                  <div className="text-of-horse">
                    <div>
                      <div className="selection-name">{selection.name}</div>
                      <div className="selection-description">
                        {selection.description}
                      </div>
                    </div>
                  </div>
                  <div className="odds-of-horse">
                    <MatchOdds selection={selection} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="more-container-in-horse" onClick={openRacecard}>
          <span className="more-sidebar-in-events">View Racecard</span>
          <ArrowIcon className="more-container-arrow" />
        </div>
      </div>
    </div>
  );
};
