import { Skeleton } from "@mui/material";
import React from "react";
import { betGroupLinks } from "../../utils/constants";

export const BetGroup = ({ isLoading, isMobile }) => {
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
                    {" "}
                    <Skeleton
                      variant="text"
                      sx={
                        !isMobile
                          ? { fontSize: "1.2rem", width: "150px" }
                          : { fontSize: "rem", width: "50px" }
                      }
                      className="my-2"
                      animation="wave"
                      key={Math.random()}
                    />
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
                  <span className="bet-group-text">{row.name}</span>
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
