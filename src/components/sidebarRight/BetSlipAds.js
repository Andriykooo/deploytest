import Image from "next/image";
import { LinkType } from "../LinkType/LinkType";
import { DynamicSelections } from "../dynamicSelections/DynamicSelections";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { gamingSocket } from "@/context/socket";
import { v4 as uuidv4 } from "uuid";

export const BetSlipAds = () => {
  const sidebarRight = useSelector((state) => state.sidebarRight);

  useEffect(() => {
    if (sidebarRight?.data) {
      sidebarRight?.data?.betslips.forEach((betslipAdd) => {
        if (betslipAdd.promo_type === "dynamic") {
          betslipAdd.buttons.forEach((selection) => {
            gamingSocket.emit("subscribe_market", {
              value: selection.bet_id,
            });
          });
        }
      });
    }

    return () => {
      if (sidebarRight?.data) {
        sidebarRight?.data?.betslips.forEach((betslipAdd) => {
          if (betslipAdd.promo_type === "dynamic") {
            betslipAdd.buttons.forEach((selection) => {
              gamingSocket.emit("unsubscribe_market", {
                value: selection.bet_id,
                action_id: uuidv4(),
              });
            });
          }
        });
      }
    };
  }, [sidebarRight?.data]);

  return sidebarRight?.data?.show_bet_holder ? (
    <div id="bet-holder" className="bet-holder">
      {sidebarRight?.data?.betslips.map((betslip, index) => {
        if (betslip.promo_type === "dynamic") {
          return (
            <div className="betslip-add" key={index}>
              <Image
                src={betslip.media.path}
                alt={betslip.media.path}
                quality={50}
                height={305}
                width={301}
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
                slug: betslip.link_details.path.substring(1),
                title: betslip.title,
              }}
              key={index}
            >
              <Image
                className="betslip-add"
                src={betslip.media.path}
                alt={betslip.media.path}
                quality={50}
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
