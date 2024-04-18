import { nextWindow } from "@/utils/nextWindow";
import * as constants from "./actionTypes";
import { getSelectionOdds } from "@/utils/getSelectionOdds";

export const initialState = {
  user: null,
  loggedUser: null,
  on_boarding: {},
  swifty_id: null,
  signup_platform: null,
  user_settings: null,
  sports: [],
  activeSport: null,
  competitionsData: [],
  setMobile: false,
  isTablet: false,
  tooltip: null,
  priceIsChanged: false,
  country: null,
  language: null,
  showMenuIcon: true,
  sportContent: {},
  betIsAccepted: false,
  betIsRejected: false,
  bonusesAndPromotions: null,
  updatedEvents: {},
  selectedBetsIds: new Set([]),
  lastVisitedPage: "/",
  selectedBets: {
    singles: [],
    stakes: [],
    action: "check",
  },
  reviewBets: {
    singles: [],
    combinations: [],
    total_stakes: 0,
    total_payout: 0,
  },
  betTicker: {
    status: "",
    bet_referral_id: "",
  },
  newOfferTimer: -1,
  betAmounts: [],
  returnAmounts: [],
  subscriptions: {},
  updatedBetslipSelections: {},
  suspendedBets: {},
  myBets: {},
  inPlay: false,
  sidebarLeft: {
    data: null,
    isActive: false,
  },
  sidebarRight: {
    data: null,
    isActive: nextWindow?.innerWidth > 1400,
  },
  footer: {
    data: null,
  },
  headerData: null,
  settings: null,
  activePage: null,
  raceCard: null,
  casinoCategory: null,
  pageLayoutContent: {},
  favouriteGames: new Set(),
  currentTime: new Date(),
  alertModal: null,
  privacyModal: { isOpen: false, callback: () => {} },
  termsModal: { isOpen: false, callback: () => {} },
  usageTime: 0,
  promo: null,
  forgotPassword: false,
  isVerifyMessage: false,
  headerNotification: {
    data: null,
    activeNotification: null,
  },
  headerBoundingClientRect: {},
  userStats: null,
  redirectAfterLogin: "",
  liveSelections: new Set(),
  freeBetCreditSelect: "",
  notifyCasinoSession: null,
  eventsData: {},
  selections: {},
  sportFilters: {},
  providersSuspended: [],
};

const rootReducer = (appstate = initialState, action) => {
  let actualReturnAmounts = [...appstate.returnAmounts];
  let includeReturnAmount = actualReturnAmounts.some(
    (item) => item.bet_id === action.payload?.bet_id
  );
  let actualBetAmounts;
  let includeAmount;

  switch (action.type) {
    case constants.BET_TICKER:
      return { ...appstate, betTicker: action.payload };
    case constants.SET_USER:
      return { ...appstate, user: action.payload };
    case constants.SET_USER_STATS:
      return { ...appstate, userStats: action.payload };
    case constants.SET_DATA:
      return { ...appstate, data: action.payload };
    case constants.SET_COUNTRY_PHONE:
      return { ...appstate, countryPhone: action.payload };
    case constants.SET_MOBILE:
      return { ...appstate, setMobile: action.payload };
    case constants.SET_TABLET:
      return { ...appstate, isTablet: action.payload };
    case constants.SET_LOGGEDUSER:
      return {
        ...appstate,
        usageTime: 0,
        loggedUser: action.payload,
      };
    case constants.SET_LOGGED_USER_DATA:
      return {
        ...appstate,
        loggedUser: {
          ...appstate.loggedUser,
          user_data: action.payload,
        },
      };
    case constants.SET_LOGOUT:
      return { ...appstate, loggedUser: action.payload };
    case constants.ON_BOARDING: {
      return {
        ...appstate,
        on_boarding: action.payload,
      };
    }
    case constants.SWIFTY_ID:
      return { ...appstate, swifty_id: action.payload };
    case constants.SIGNUP_PLATFORM:
      return { ...appstate, signup_platform: action.payload };
    case constants.USER_SETTINGS:
      return { ...appstate, user_settings: action.payload };
    case constants.SPORT_TYPES:
      return { ...appstate, sports: action.payload };
    case constants.ACTIVE_SPORT:
      return { ...appstate, activeSport: action.payload };
    case constants.COMPETITIONS_DATA:
      return { ...appstate, competitionsData: action.payload };
    case constants.SET_COUNTRY:
      return { ...appstate, country: action.payload };
    case constants.SET_LAST_VISITED_PAGE:
      return { ...appstate, lastVisitedPage: action.payload };
    case constants.SET_REDIRECT_AFTER_LOGIN:
      return { ...appstate, redirectAfterLogin: action.payload };
    case constants.SELECT_BET:
      return {
        ...appstate,
        selectedBets: action.payload,
      };
    case constants.MERGE_SELECTED_BETS: {
      const formatedSingles = {};
      const updatedLiveSelections = new Set([]);
      const selectedBetsIds = new Set([]);

      action.payload.singles.forEach((single) => {
        const bet_id = `${single.bet_provider}-${single.bet_id}`;
        delete single.stake;

        if (single.in_play) {
          updatedLiveSelections.add(`${single.bet_provider}-${single.bet_id}`);
        }

        formatedSingles[bet_id] = {
          ...single,
          bet_id,
        };
      });

      const updatedSingles = appstate?.selectedBets?.singles?.map((single) => {
        selectedBetsIds.add(single.bet_id);

        return {
          ...single,
          ...formatedSingles[single.bet_id],
        };
      });

      return {
        ...appstate,
        liveSelections: updatedLiveSelections,
        selectedBetsIds,
        selectedBets: {
          ...action.payload,
          stakes: appstate?.selectedBets?.stakes,
          singles: updatedSingles,
        },
      };
    }

    case constants.REMOVE_BET:
      if (action.payload === "all") {
        return {
          ...appstate,
          selectedBets: {
            singles: [],
            stakes: [],
            action: "check",
          },
          updatedBetslipSelections: {},
          priceIsChanged: false,
        };
      } else {
        const priceChanges = { ...appstate.updatedBetslipSelections };

        const filteredBets = appstate.selectedBets.singles.filter((row) => {
          if (action?.payload?.type === "unnamed_favorite") {
            return action.payload.bet_id !== row.bet_id;
          }

          const exist = action?.payload?.bet_id === row.bet_id;

          if (exist) {
            delete priceChanges[row.bet_id];
          }

          return !exist;
        });

        return {
          ...appstate,
          selectedBets: { ...appstate.selectedBets, singles: filteredBets },
          updatedBetslipSelections: priceChanges,
          priceIsChanged: false,
        };
      }
    case constants.SET_BET_AMOUNT:
      actualBetAmounts = [...appstate.betAmounts];
      includeAmount = actualBetAmounts.some(
        (item) => item.bet_id === action.payload?.bet_id
      );
      if (includeAmount) {
        actualBetAmounts = actualBetAmounts.filter(
          (row) => row.bet_id !== action.payload?.bet_id
        );
        actualBetAmounts.push(action.payload);
      } else {
        actualBetAmounts.push(action.payload);
      }
      return {
        ...appstate,
        betAmounts: actualBetAmounts,
      };
    case constants.REMOVE_BET_AMOUNT:
      if (action.payload === "all") {
        return { ...appstate, betAmounts: [] };
      } else {
        let filteredBetAmounts = [...appstate.betAmounts];
        filteredBetAmounts = filteredBetAmounts.filter(
          (row) => row.bet_id !== action.payload
        );
        return { ...appstate, betAmounts: filteredBetAmounts };
      }
    case constants.SET_RETURN_AMOUNT:
      if (includeReturnAmount) {
        actualReturnAmounts = actualReturnAmounts.filter(
          (row) => row.bet_id !== action.payload?.bet_id
        );
        actualReturnAmounts.push(action.payload);
      } else {
        actualReturnAmounts.push(action.payload);
      }

      return {
        ...appstate,
        returnAmounts: actualReturnAmounts,
      };
    case constants.REMOVE_RETURN_AMOUNT:
      if (action.payload === "all") {
        return { ...appstate, returnAmounts: [] };
      } else {
        let filteredBetAmounts = [...appstate.returnAmounts];

        filteredBetAmounts = filteredBetAmounts.filter(
          (row) => row.bet_id !== action.payload
        );
        return { ...appstate, returnAmounts: filteredBetAmounts };
      }
    case constants.IN_PLAY:
      return {
        ...appstate,
        inPlay: action.payload,
      };

    case constants.SET_SIDEBAR_LEFT:
      return {
        ...appstate,
        sidebarLeft: { ...appstate.sidebarLeft, ...action.payload },
      };

    case constants.SET_NEW_OFFER_TIMER:
      return {
        ...appstate,
        newOfferTimer: action.payload,
      };

    case constants.SET_BONUSES_AND_PROMOTIONS:
      return {
        ...appstate,
        bonusesAndPromotions: {
          ...appstate.bonusesAndPromotions,
          ...action.payload,
        },
      };

    case constants.ADD_USAGE_TIME:
      return {
        ...appstate,
        usageTime: appstate.usageTime + action.payload,
      };

    case constants.SET_HEADER_DATA:
      return {
        ...appstate,
        headerData: action.payload,
      };

    case constants.SET_SIDEBAR_RIGHT:
      return {
        ...appstate,
        sidebarRight: { ...appstate.sidebarRight, ...action.payload },
      };

    case constants.SET_LANGUAGE:
      return {
        ...appstate,
        language: action.payload,
      };

    case constants.SET_HEADER_BOINDING_CLIENT_RECT:
      return {
        ...appstate,
        headerBoundingClientRect: action.payload,
      };

    case constants.SET_SETTINGS:
      return {
        ...appstate,
        settings: { ...appstate.settings, ...action.payload },
      };

    case constants.SET_ACTIVE_PAGE:
      return {
        ...appstate,
        activePage: action.payload,
      };

    case constants.SET_RACE_CARD:
      return {
        ...appstate,
        raceCard: action.payload,
      };

    case constants.SET_CASINO_CATEGORY:
      return {
        ...appstate,
        casinoCategory: action.payload,
      };

    case constants.SET_PAGE_LAYOUT_CONTENT:
      return {
        ...appstate,
        pageLayoutContent: action.payload,
      };

    case constants.SET_FOOTER:
      return {
        ...appstate,
        footer: action.payload,
      };

    case constants.SET_MY_BETS:
      return {
        ...appstate,
        myBets: action.payload,
      };

    case constants.SET_BET_IS_ACCEPTED:
      return {
        ...appstate,
        betIsAccepted: action.payload,
      };

    case constants.SET_BET_IS_REJECTED:
      return {
        ...appstate,
        betIsRejected: action.payload,
      };

    case constants.SET_IS_VERIFY_MESSAGE:
      return {
        ...appstate,
        isVerifyMessage: action.payload,
      };

    case constants.SET_HEADER_NOTIFICATION:
      return {
        ...appstate,
        headerNotification: action.payload,
      };

    case constants.ADD_EVENT_DATA:
      return {
        ...appstate,
        eventsData: {
          ...appstate.eventsData,
          [action.payload.data.event_id]: {
            ...action.payload.data,
            markets: {
              ...(appstate.eventsData[action.payload.data.event_id]
                ? appstate.eventsData[action.payload.data.event_id].markets
                : {}),
              [action.payload.marketId]: action.payload.data.markets,
            },
          },
        },
      };

    case constants.SET_UPDATED_EVENTS: {
      return {
        ...appstate,
        updatedEvents: action.payload,
      };
    }

    case constants.ADD_UPDATED_EVENTS: {
      const newEvents = { ...appstate.updatedEvents };

      action.payload.forEach((event) => {
        newEvents[event.data.event_id] = event;
      });

      return {
        ...appstate,
        updatedEvents: newEvents,
      };
    }

    case constants.ADD_TO_UPDATED_BETSLIP_SELECTIONS:
      return {
        ...appstate,
        updatedBetslipSelections: {
          ...appstate.updatedBetslipSelections,
          [action.payload.bet_id]: action.payload,
        },
      };

    case constants.SET_UPDATED_BETSLIP_SELECTIONS:
      return {
        ...appstate,
        updatedBetslipSelections: action.payload,
      };

    case constants.SET_REVIEW_BETS:
      return {
        ...appstate,
        reviewBets: action.payload,
      };

    case constants.SET_SHOW_MENU_ICON:
      return {
        ...appstate,
        showMenuIcon: action.payload,
      };

    case constants.RESET_SESSION:
      return {
        ...initialState,
      };

    case constants.UPDATE_PAGE_LAYOUT_CONTENT:
      return {
        ...appstate,
        pageLayoutContent: {
          ...appstate.pageLayoutContent,
          [action.payload.slug]: {
            ...appstate.pageLayoutContent[action.payload.slug],
            content: appstate.pageLayoutContent[
              action.payload.slug
            ]?.content?.map((component) => {
              if (+component.type_id === +action.payload.content.type_id) {
                return action.payload.content;
              }

              if (
                action.payload.content.type === "casino_category" &&
                (component.type === "casino" ||
                  component.type === "live_casino")
              ) {
                return {
                  ...component,
                  casino: component.casino.map((category) => {
                    if (+category.id === +action.payload.content.type_id) {
                      return action.payload.content.casino_category;
                    }

                    return category;
                  }),
                };
              }

              return component;
            }),
          },
        },
      };

    case constants.SET_SUBSCRIPTIONS:
      return {
        ...appstate,
        subscriptions: { ...appstate.subscriptions, ...action.payload },
      };

    case constants.SET_PRICE_IS_CHANGED: {
      return {
        ...appstate,
        priceIsChanged: action.payload,
      };
    }

    case constants.SET_FAVOURITE_GAMES: {
      return {
        ...appstate,
        favouriteGames: new Set(action.payload),
      };
    }

    case constants.ADD_TO_FAVOURITE_GAMES: {
      const updatedFavoriteGames = new Set(appstate.favouriteGames);
      updatedFavoriteGames.add(action.payload);

      return {
        ...appstate,
        favouriteGames: updatedFavoriteGames,
      };
    }

    case constants.REMOVE_FROM_FAVOURITE_GAMES: {
      const updatedFavoriteGames = new Set(appstate.favouriteGames);
      updatedFavoriteGames.delete(action.payload);

      return {
        ...appstate,
        favouriteGames: updatedFavoriteGames,
      };
    }

    case constants.SET_CURRENT_TIME:
      return {
        ...appstate,
        currentTime: action.payload,
      };

    case constants.UPDATE_USER_BALANCE:
      if (appstate.loggedUser) {
        return {
          ...appstate,
          loggedUser: {
            ...appstate.loggedUser,
            user_data: {
              ...appstate.loggedUser.user_data,
              balance: action.payload,
            },
          },
        };
      }

      break;

    case constants.SET_MARKET_OPTIONS:
      return {
        ...appstate,
        marketOptions: action.payload,
      };

    case constants.SET_ALERT_MODAL:
      return {
        ...appstate,
        alertModal: action.payload,
      };

    case constants.SET_PRIVACY_MODAL:
      return {
        ...appstate,
        privacyModal: action.payload,
      };

    case constants.SET_TERMS_MODAL:
      return {
        ...appstate,
        termsModal: action.payload,
      };

    case constants.SET_PROMO:
      return {
        ...appstate,
        promo: action.payload,
      };

    case constants.SET_SPORT_CONTENT:
      return {
        ...appstate,
        sportContent: {
          ...appstate.sportContent,
          ...action.payload,
        },
      };

    case constants.SET_SELECTIONS: {
      return {
        ...appstate,
        selections: action.payload,
      };
    }

    case constants.UPDATE_SELECTIONS: {
      const newSelectionsData = {};
      const updatedBetslipSelections = { ...appstate.updatedBetslipSelections };
      let priceIsChanged = appstate.priceIsChanged;

      action.payload.forEach((item) => {
        const selection = item?.data || item;
        const prevSelection = appstate.selections[selection.bet_id] || {};

        const oldSelectionOdds = getSelectionOdds(prevSelection);
        const newSelectionOdds = getSelectionOdds(selection);

        let newData = {
          ...prevSelection,
          ...selection,
        };

        if (
          oldSelectionOdds?.odds_decimal &&
          oldSelectionOdds?.odds_decimal !== "SP" &&
          newSelectionOdds?.odds_decimal == "SP"
        ) {
          newData = { ...prevSelection };
        }

        const hasOddsDifference =
          oldSelectionOdds?.odds_decimal &&
          newSelectionOdds?.odds_decimal !== "SP" &&
          +oldSelectionOdds.odds_decimal !== +newSelectionOdds.odds_decimal;

        if (hasOddsDifference) {
          newData.previousOdds = oldSelectionOdds;
        }

        if (appstate.selectedBetsIds.has(selection.bet_id)) {
          const newSelectedBetdata = { ...newData };

          if (hasOddsDifference) {
            priceIsChanged = true;
            newSelectedBetdata.priceChangeType =
              +oldSelectionOdds.odds_decimal < +newSelectionOdds.odds_decimal
                ? "drifting"
                : "shortening";
          }

          updatedBetslipSelections[selection.bet_id] = newSelectedBetdata;
        }

        newSelectionsData[selection.bet_id] = newData;
      });

      const updatedData = {
        selections: { ...appstate.selections, ...newSelectionsData },
        updatedBetslipSelections,
      };

      return {
        ...appstate,
        ...updatedData,
        priceIsChanged,
      };
    }

    case constants.SET_TOOLTIP:
      return {
        ...appstate,
        tooltip: action.payload,
      };

    case constants.DESTROY_SESSION:
      return {
        ...initialState,
        headerData: appstate.headerData,
        sportContent: appstate.sportContent,
        pageLayoutContent: appstate.pageLayoutContent,
        sidebarLeft: {
          data: appstate?.sidebarLeft?.data,
          isActive: false,
        },
        sidebarRight: {
          data: appstate?.sidebarRight?.data,
          isActive: nextWindow?.innerWidth > 1400,
        },
        on_boarding: appstate.on_boarding,
        language: appstate.language,
        settings: appstate.language,
      };

    case constants.SET_FREE_BET_CREDIT_SELECT:
      return {
        ...appstate,
        freeBetCreditSelect: action.payload,
      };

    case constants.SET_FORGOT_PASSWORD:
      return {
        ...appstate,
        forgotPassword: action.payload,
      };
    case constants.SET_NOTIFY_CASINO_SESSION: {
      return {
        ...appstate,
        notifyCasinoSession: action.payload,
      };
    }
    case constants.SET_SPORT_FILTERS: {
      return {
        ...appstate,
        sportFilters: {
          ...appstate.sportFilters,
          ...action.payload,
        },
      };
    }
    case constants.ADD_PROVIDER_SUSPENDED: {
      return {
        ...appstate,
        providersSuspended: appstate.providersSuspended.includes(action.payload)
          ? [...appstate.providersSuspended]
          : [...appstate.providersSuspended, action.payload],
      };
    }
    case constants.REMOVE_PROVIDER_SUSPENDED: {
      return {
        ...appstate,
        providersSuspended: appstate.providersSuspended.filter(
          (p) => p != action.payload
        ),
      };
    }

    default:
      return { ...appstate };
  }
};

export default rootReducer;
