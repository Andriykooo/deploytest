import { images } from "./imagesConstant";

export const BET_HISTORY_ALL_TAB = 'all';
export const BET_HISTORY_OPEN_TAB = 'open';
export const BET_HISTORY_SETTLED_TAB = 'settled';

export const BET_HISTORY_TABS = [
  {
    label: 'All',
    value: BET_HISTORY_ALL_TAB,
    icon: images.allPending,
  },
  {
    label: 'Open',
    value: BET_HISTORY_OPEN_TAB,
    icon: images.openPending,
  },
  {
    label: 'Settled',
    value: BET_HISTORY_SETTLED_TAB,
    icon: images.settledDone,
  },
];
