import React from "react";
import { Button } from "../button/Button";
import { EventTable } from "../eventTable/EventTable";

function HeroWidget({ data }) {
  return (
    <div className="betting-in-home-slider">
      <img
        alt="Hero widget"
        src={data?.header_banner}
        className="handballLogoImage"
      />
      {data?.title && <p className="slider-title-in-homepage">{data.title}</p>}
      {data.subtitle && (
        <p className="slider-title-in-homepage-description">{data.subtitle}</p>
      )}
      <Button className={"btnPrimary buttonOfSlider"} text={"Go to event"} />

      {data.selections.length > 3 ? (
        <EventTable data={data.selections} />
      ) : (
        <div className="container-of-bets-in-slider">
          {data.selections?.map((row, index) => {
            return (
              <div className="container-of-bets-in-row" key={index}>
                <span className="markets-slider-page">{row?.name}</span>
                <span className="bets-of-markets-slider">
                  {parseFloat(row?.odd).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HeroWidget;
