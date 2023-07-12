import { Skeleton } from "@mui/material";
import { LinkType } from "../LinkType/LinkType";

export const Banner = ({ data, isLoading }) => {
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
          {data?.media_type === "iframe" ? (
            <iframe
              src={data?.media}
              width="100%"
              height="100%"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Banner"
            ></iframe>
          ) : (
            <img src={data?.media?.path} alt="Banner" />
          )}
          <div className="textContainer">
            <div className="firstImageText">
              {data?.title}
              {data?.subtitle && (
                <div className="secondImageText">{data?.subtitle}</div>
              )}
            </div>
            {data?.link_details?.name && (
              <LinkType
                type={data?.link_details?.type}
                path={data?.link_details?.path}
                openType={data?.link_details?.open_type}
                modalData={{
                  slug: data?.link_details?.path.substring(1),
                  name: data?.title,
                }}
              >
                <button className="btnPrimary bannerButton buttonOfSlider">
                  {data?.link_details?.name}
                </button>
              </LinkType>
            )}
          </div>
        </>
      )}
    </div>
  );
};
