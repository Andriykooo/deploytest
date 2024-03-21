"use client";

import { Skeleton } from "@/components/Skeleton/Skeleton";
import classNames from "classnames";
import React from "react";

const SkeletonComponent = ({ disableHeader, className }) => {
  const skeletonHeader = new Array(15).fill(0);

  return (
    <div className={classNames("mainArticle", className)}>
      {!disableHeader && (
        <Skeleton
          className="my-3 skeleton-component-header"
          height={145}
          width={"100%"}
        />
      )}

      {skeletonHeader.map((_, index) => (
        <Skeleton className="mb-2" key={index} height={30} width={"100%"} />
      ))}
    </div>
  );
};
export default SkeletonComponent;
