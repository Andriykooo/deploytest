import { liveGamesData } from "../../utils/constants";
import "./LetsPlay.css";

export const LetsPlay = () => {
  return (
    <div className="lets-play">
      <div className="descriptionStyleOfPlay">
        <div className="descriptionStyleOfPlayFirst">
          Let’s <span className="descriptionStyleOfPlay">play!</span>
        </div>
      </div>
      <div className="home-live-matches-footer">
        {liveGamesData.map((row, index) => (
          <div className="containerOfLiveGamesFooter" key={index}>
            {row.icon}
            <p className="titleOfLiveGames">{row.title}</p>
            <p className="paragraphOfLiveGame">{row.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
