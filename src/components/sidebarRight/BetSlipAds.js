import Image from "next/image";
import { LinkType } from "../LinkType/LinkType";
import { DynamicSelections } from "../dynamicSelections/DynamicSelections";
import { useSelector } from "react-redux";

export const BetSlipAds = () => {
  const sidebarRight = useSelector((state) => state.sidebarRight);

  return sidebarRight?.data?.show_bet_holder ? (
    <div id="bet-holder" className="bet-holder">
      {sidebarRight?.data?.betslips.map((betslip, index) => {
        if (betslip.promo_type === "dynamic") {
          return (
            <div className="betslip-add" key={index}>
              <Image
                src={betslip.media.path}
                alt={betslip.media.path}
                height={305}
                width={301}
                priority
              />
              <div className="dynamic-betslip">
                <DynamicSelections
                  selections={betslip.buttons}
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
                slug: betslip?.link_details?.path?.substring(1),
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
                priority
              />
            </LinkType>
          );
        }

        return null;
      })}
    </div>
  ) : null;
};
