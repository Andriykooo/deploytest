"use client";

import { Skeleton } from "@mui/material";
import { LinkType } from "../LinkType/LinkType";
import { widgetDisplayRestriction } from "@/hoc/widgetDisplayRestriction";

const BannerComponent = ({ data, isLoading }) => {
  return (
    <div className="imageContainer">
      {isLoading ? (
        <>
          <Skeleton
            sx={{
              fontSize: "1.5rem",
              bgcolor: "#212536",
              height: "100%",
              width: "95%",
              margin: "0 auto",
            }}
            animation="wave"
            variant="rectangular"
          />
          <div className="textContainer">
            <div className="firstImageText">
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ fontSize: "2rem" }}
                width={250}
                height={50}
              />
              <br />
              <span className="secondImageText">
                <Skeleton
                  animation="wave"
                  variant="text"
                  sx={{ fontSize: "2rem" }}
                  width={100}
                  height={50}
                />
              </span>
            </div>
            <button className="btnPrimary playButton">
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ fontSize: "0" }}
              />
            </button>
          </div>
        </>
      ) : (
        <>
          <img src={data.details.image} alt="banner" />
          <div className="textContainer">
            <div className="firstImageText">
              {data?.title}
              {data?.subtitle && (
                <div className="secondImageText">{data?.subtitle}</div>
              )}
            </div>
            {data?.link_details?.name && (
              <LinkType
                type={data?.details?.link_type}
                path={data?.details?.link}
                openType={data?.link_details?.open_type}
                modalData={{
                  slug: data?.details?.link_slug,
                  name: data?.title,
                }}
              >
                <button className="btnPrimary bannerButton buttonOfSlider">
                  {data?.details?.call_to_action}
                </button>
              </LinkType>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export const Banner = widgetDisplayRestriction(BannerComponent);
