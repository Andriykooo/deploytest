import { Skeleton } from "@mui/material";
import Link from "next/link";

export const HeroBanner = ({ data, isLoading }) => {
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
              title="heroBanner"
            ></iframe>
          ) : (
            <img src={data?.media?.path} alt="Hero Banner" />
          )}

          <div className="textContainer">
            <div className="firstImageText">
              {data?.title}

              {data?.subtitle && (
                <>
                  <br />
                  <span className="secondImageText">{data?.subtitle}</span>
                </>
              )}
            </div>
            {data?.link_details?.name && (
              <Link href={data?.link_details?.path}>
                <button className="btnPrimary heroBannerButton buttonOfSlider">
                  {data?.link_details?.name}
                </button>
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
};
