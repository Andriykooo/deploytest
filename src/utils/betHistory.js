import { images } from "./imagesConstant";

export const BET_HISTORY_ALL_TAB = 'all';
export const BET_HISTORY_OPEN_TAB = 'open';
export const BET_HISTORY_SETTLED_TAB = 'settled';

export const BET_HISTORY_TABS = [
  {
    label: 'all',
    value: BET_HISTORY_ALL_TAB,
    icon: images.allPending,
  },
  {
    label: 'open',
    value: BET_HISTORY_OPEN_TAB,
    icon: images.openPending,
  },
  {
    label: 'settled',
    value: BET_HISTORY_SETTLED_TAB,
    icon: images.settledDone,
  },
];
