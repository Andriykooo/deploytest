"use client";

import React from "react";
import { useSelector } from "react-redux";

const SkeletonComponent = ({ matchesLoading }) => {
  const skeletonHeader = new Array(4).fill(0);
  const skeleteInline = new Array(11).fill(0);

  const isMobile = useSelector((state) => state.setMobile);
  const activeSport = useSelector((state) => state.activeSport);

  return (
    <div className="mainArticle">
      <div className="row w-100 sports-matches-container m-0 sportsMatchesContainer">
        <div className="col-12 sports-body skeleton-large-screen sports-match-details-skeleton-container">
          {isMobile && activeSport && null}

          {activeSport && skeleteInline.map((item, index) => null)}
          {!matchesLoading &&
            skeletonHeader.map((item, index) => {
              return <React.Fragment key={index}></React.Fragment>;
            })}
        </div>
      </div>
    </div>
  );
};
export default SkeletonComponent;
