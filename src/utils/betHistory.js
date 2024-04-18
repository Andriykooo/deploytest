import { AllPendingBetHistory } from "@/icons/AllPendingBetHistory";
import { OpenPendingBetHistory } from "@/icons/OpenPendingBetHistory";
import { SettledDoneBetHistory } from "@/icons/SettledDoneBetHistory";

export const BET_HISTORY_ALL_TAB = "all";
export const BET_HISTORY_OPEN_TAB = "open";
export const BET_HISTORY_SETTLED_TAB = "settled";

export const BET_HISTORY_TABS = [
  {
    label: "all",
    value: BET_HISTORY_ALL_TAB,
    icon: <AllPendingBetHistory />,
  },
  {
    label: "open",
    value: BET_HISTORY_OPEN_TAB,
    icon: <OpenPendingBetHistory />,
  },
  {
    label: "settled",
    value: BET_HISTORY_SETTLED_TAB,
    icon: <SettledDoneBetHistory />,
  },
];
