import Link from "next/link";

export const BetSlipAds = ({ sidebarRightData }) => {
  return sidebarRightData?.show_bet_holder ? (
    <div id="bet-holder">
      {sidebarRightData?.betslips.map((betslip, index) => {
        return (
          <Link href={betslip.link_details.path} key={index}>
            <img
              className="betslip-add"
              src={betslip.media.path}
              alt={betslip.media.path}
            />
          </Link>
        );
      })}
    </div>
  ) : null;
};
