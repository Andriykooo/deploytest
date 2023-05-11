import React from "react";
import { Accordion } from "react-bootstrap";
import pointer from "../../assets/images/pointer.png";
import { matches, titlePerRow, countries } from "../../utils/constants";

const HorseCard = () => {
  return (
    <>
      <div className="matchCardRowContainer titleContainer">
        {titlePerRow.map((title, index) => (
          <div key={index} className="matchCard row titleRow">
            {title.titleRow}
            <div className="underTitle">{title.underTitle}</div>
          </div>
        ))}
      </div>
      <div className="matchCardRowContainer matchCardRowContainer2">
        {matches.map((match, index) => (
          <div key={index} className={`matchCard row matchCardRow2`}>
            <div className="matchTeam matchTeamStyle matchTeam2">
              <div className="matchTeam2">{match.homeTeam}</div>
              <div className="author">{match.author}</div>
            </div>
            <div className="bet">{match.bet}</div>
          </div>
        ))}
      </div>
      <div className="matchCardRowContainer matchCardRowContainer2">
        {titlePerRow.map((title, index) => (
          <div key={index} className={`matchCard row matchCardRow2`}>
            <div className="matchTeam matchTeamStyle matchTeam2 viewCard">
              {title.viewCard}
            </div>
          </div>
        ))}
      </div>

      <div className="countries">
        <Accordion.Header> UK And Ireland</Accordion.Header>
        <div className="matchCardRowContainer matchCardRowContainer2">
          {countries.map((country, index) => (
            <div
              key={index}
              className="matchCard row matchCardRow2 matchCardRowWidth"
            >
              <div className="matchTeam matchTeamStyle matchTeam2">
                <div className="matchTeam2">{country.city}</div>
              </div>
              {country.countryItem && country.countryItem.length > 0 ? (
                country.countryItem.map((item) => (
                  <div
                    key={index}
                    className={
                      item.time === "16:00" || item.time === "17:00"
                        ? "countriesItem whiteTxt"
                        : "countriesItem"
                    }
                  >
                    <img
                      alt="pointerImg"
                      src={pointer}
                      className="pointerImg"
                    />
                    {item.time}
                  </div>
                ))
              ) : (
                <div className="countriesItem">No time available</div>
              )}
            </div>
          ))}
        </div>
        <div className="horseHeader">
          <Accordion.Header> International</Accordion.Header>
        </div>
      </div>
    </>
  );
};

export default HorseCard;
