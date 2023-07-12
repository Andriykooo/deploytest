import Image from "next/image";
import { LinkType } from "../LinkType/LinkType";
import { DynamicSelections } from "../dynamicSelections/DynamicSelections";

export const BetSlipAds = ({ sidebarRightData }) => {
  return sidebarRightData?.show_bet_holder ? (
    <div id="bet-holder">
      {sidebarRightData?.betslips.map((betslip, index) => {
        if (betslip.promo_type === "dynamic") {
          return (
            <div className="betslip-add" key={index}>
              <Image
                src={betslip.media.path}
                alt={betslip.media.path}
                height={305}
                width={301}
              />
              <div className="dynamic-betslip">
                <DynamicSelections
                  selections={betslip.selections}
                  eventId={betslip.link_details.event_id}
                />
              </div>
            </div>
          );
        }

        if (betslip.promo_type === "default") {
          return (
            <LinkType
              type={betslip.link_details.type}
              path={betslip.link_details.path}
              openType={betslip.link_details?.open_type}
              modalData={{
                slug: betslip.link_details.path.substring(1),
                title: betslip.title,
              }}
              key={index}
            >
              <Image
                className="betslip-add"
                src={betslip.media.path}
                alt={betslip.media.path}
                height={305}
                width={301}
              />
            </LinkType>
          );
        }

        return null;
      })}
    </div>
  ) : null;
};
