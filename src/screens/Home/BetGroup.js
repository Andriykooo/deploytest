import React from "react";
import { betGroupLinks } from "../../utils/constants";
import { useTranslations } from "next-intl";
export const BetGroup = ({ isLoading, isMobile }) => {
  const t = useTranslations("home");
  let counter = 0;
  const maxCounter = betGroupLinks.length - 1;

  return (
    <div className="bet-group-container">
      {betGroupLinks.map((row, index) => {
        counter++;

        return (
          <React.Fragment key={index}>
            {isLoading ? (
              <>
                <div className="bet-group" key={row.name}>
                  <span className="bet-group-text">

                  </span>
                </div>
                {counter <= maxCounter && (
                  <span className="borderOfLeftSideOFBetGroup"></span>
                )}
              </>
            ) : (
              <>
                <div className="bet-group" key={row.name}>
                  {row.icon}
                  <span className="bet-group-text">{t(row.name)}</span>
                </div>
                {counter <= maxCounter && (
                  <span className="borderOfLeftSideOFBetGroup"></span>
                )}
              </>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
