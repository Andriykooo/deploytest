import Image from "next/image";
import { LinkType } from "../LinkType/LinkType";
import { DynamicSelections } from "../dynamicSelections/DynamicSelections";
import { useSelector } from "react-redux";

export const BetSlipAds = () => {
  const sidebarRight = useSelector((state) => state.sidebarRight);

  return sidebarRight?.data?.show_bet_holder ? (
    <div id="bet-holder" className="bet-holder">
      {sidebarRight?.data?.betslips?.map((betslip) => {
        if (betslip.promo_type === "dynamic") {
          return (
            <div className="betslip-add" key={betslip.id}>
              <Image
                src={betslip.image}
                alt={betslip.title}
                height={294}
                width={290}
                priority
                className="w-100"
              />
              <div className="dynamic-betslip">
                <DynamicSelections
                  selections={betslip.button.selections}
                  eventId={betslip.button.event_id}
                />
              </div>
            </div>
          );
        }

        if (betslip.promo_type === "default") {
          return (
            <LinkType
              type={betslip.link_type}
              path={betslip.button.link}
              openType={betslip?.open_type}
              modalData={{
                slug: betslip.button.link.substring(1),
                title: betslip.title,
              }}
              key={betslip.id}
            >
              <Image
                className="betslip-add"
                src={betslip.image}
                alt={betslip.title}
                height={294}
                width={290}
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
