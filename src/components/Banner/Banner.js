import { LinkType } from "../LinkType/LinkType";
import { widgetDisplayRestriction } from "@/hoc/widgetDisplayRestriction";

const BannerComponent = ({ data }) => {
  return (
    <div className="imageContainer">
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
    </div>
  );
};

export const Banner = widgetDisplayRestriction(BannerComponent);
