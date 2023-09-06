"use client";

import { Skeleton } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const SkeletonComponent = ({ matchesLoading }) => {
  const skeletonHeader = new Array(4).fill(0);
  const skeleteInline = new Array(11).fill(0);

  const isMobile = useSelector((state) => state.setMobile);
  const activeSport = useSelector((state) => state.activeSport);

  return (
    <>
      <div className="mainArticle">
        <div className="row w-100 sports-matches-container m-0 sportsMatchesContainer">
          <div className="col-12 sports-body skeleton-large-screen sports-match-details-skeleton-container">
            {isMobile && activeSport && (
              <Skeleton
                variant="rectangular"
                sx={{ fontSize: "5.2rem", bgcolor: "#212536" }}
                animation="wave"
              />
            )}

            {activeSport &&
              skeleteInline.map((item, index) => (
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem", bgcolor: "#grey" }}
                  className="mt-2"
                  animation="wave"
                  key={index}
                />
              ))}
            {!matchesLoading &&
              skeletonHeader.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "2rem", bgcolor: "#212536" }}
                      className="mt-2"
                      animation="wave"
                      key={index}
                    />
                    {skeletonHeader.map((item, index) => (
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "1.2rem" }}
                        className="my-2"
                        animation="wave"
                        key={index}
                      />
                    ))}
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};
export default SkeletonComponent;
