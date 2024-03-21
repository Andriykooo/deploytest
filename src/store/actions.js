import * as constants from "./actionTypes";

export const setUser = (payload) => {
  return {
    type: constants.SET_USER,
    payload,
  };
};

export const setData = (payload) => {
  return {
    type: constants.SET_DATA,
    payload,
  };
};

export const resetSession = (payload) => {
  return {
    type: constants.RESET_SESSION,
    payload,
  };
};

export const addEventData = (payload) => {
  return {
    type: constants.ADD_EVENT_DATA,
    payload,
  };
};

export const setSelections = (payload) => {
  return {
    type: constants.SET_SELECTIONS,
    payload,
  };
};

export const updateSelections = (payload) => {
  return {
    type: constants.UPDATE_SELECTIONS,
    payload,
  };
};

export const setRedirectAfterLogin = (payload) => {
  return {
    type: constants.SET_REDIRECT_AFTER_LOGIN,
    payload,
  };
};

export const setHeaderBoundingClientRect = (payload) => {
  return {
    type: constants.SET_HEADER_BOINDING_CLIENT_RECT,
    payload,
  };
};

export const setMyBets = (payload) => {
  return {
    type: constants.SET_MY_BETS,
    payload,
  };
};

export const setBetIsRejected = (payload) => {
  return {
    type: constants.SET_BET_IS_REJECTED,
    payload,
  };
};

export const setBetIsAccepted = (payload) => {
  return {
    type: constants.SET_BET_IS_ACCEPTED,
    payload,
  };
};

export const setBonusesAndPromotions = (payload) => {
  return {
    type: constants.SET_BONUSES_AND_PROMOTIONS,
    payload,
  };
};

export const addUsageTime = (payload) => {
  return {
    type: constants.ADD_USAGE_TIME,
    payload,
  };
};

export const setCountryPhone = (payload) => {
  return {
    type: constants.SET_COUNTRY_PHONE,
    payload,
  };
};

export const setLastVisitedPage = (payload) => {
  return {
    type: constants.SET_LAST_VISITED_PAGE,
    payload,
  };
};

export const setShowMenuIcon = (payload) => {
  return {
    type: constants.SET_SHOW_MENU_ICON,
    payload,
  };
};

export const setCountry = (payload) => {
  return {
    type: constants.SET_COUNTRY,
    payload,
  };
};

export const setMobile = (payload) => {
  return {
    type: constants.SET_MOBILE,
    payload,
  };
};

export const setTablet = (payload) => {
  return {
    type: constants.SET_TABLET,
    payload,
  };
};

export const setLoggedUser = (payload) => {
  return {
    type: constants.SET_LOGGEDUSER,
    payload,
  };
};
export const setLogOut = (payload) => {
  return {
    type: constants.SET_LOGOUT,
    payload,
  };
};

export const setOnBoardingData = (payload) => {
  return {
    type: constants.ON_BOARDING,
    payload,
  };
};

export const setSwiftyId = (payload) => {
  return {
    type: constants.SWIFTY_ID,
    payload,
  };
};

export const setSignUpPlatform = (payload) => {
  return {
    type: constants.SIGNUP_PLATFORM,
    payload,
  };
};

export const setUserSettings = (payload) => {
  return {
    type: constants.USER_SETTINGS,
    payload,
  };
};

export const setSportTypes = (payload) => {
  return {
    type: constants.SPORT_TYPES,
    payload,
  };
};

export const setActiveSport = (payload) => {
  return {
    type: constants.ACTIVE_SPORT,
    payload,
  };
};

export const setCompetitions = (payload) => {
  return {
    type: constants.COMPETITIONS_DATA,
    payload,
  };
};

export const setSelectBet = (payload) => {
  return {
    type: constants.SELECT_BET,
    payload,
  };
};

export const mergeSelectedBets = (payload) => {
  return {
    type: constants.MERGE_SELECTED_BETS,
    payload,
  };
};

export const setBetTicker = (payload) => {
  return {
    type: constants.BET_TICKER,
    payload,
  };
};

export const removeBet = (payload) => {
  return {
    type: constants.REMOVE_BET,
    payload,
  };
};

export const setBetAmount = (payload) => {
  return {
    type: constants.SET_BET_AMOUNT,
    payload,
  };
};

export const setNewOfferTimer = (payload) => {
  return {
    type: constants.SET_NEW_OFFER_TIMER,
    payload,
  };
};

export const removeBetAmount = (payload) => {
  return {
    type: constants.REMOVE_BET_AMOUNT,
    payload,
  };
};

export const setReturnValue = (payload) => {
  return {
    type: constants.SET_RETURN_AMOUNT,
    payload,
  };
};

export const removeReturnValue = (payload) => {
  return {
    type: constants.REMOVE_RETURN_AMOUNT,
    payload,
  };
};

export const setInPlay = (payload) => {
  return {
    type: constants.IN_PLAY,
    payload,
  };
};

export const setSidebarLeft = (payload) => {
  return {
    type: constants.SET_SIDEBAR_LEFT,
    payload,
  };
};

export const setSidebarRight = (payload) => {
  return {
    type: constants.SET_SIDEBAR_RIGHT,
    payload,
  };
};

export const setHeaderData = (payload) => {
  return {
    type: constants.SET_HEADER_DATA,
    payload,
  };
};

export const setActivePage = (payload) => {
  return {
    type: constants.SET_ACTIVE_PAGE,
    payload,
  };
};

export const setSportContent = (payload) => {
  return {
    type: constants.SET_SPORT_CONTENT,
    payload,
  };
};

export const setLanguage = (payload) => {
  return {
    type: constants.SET_LANGUAGE,
    payload,
  };
};

export const setSettings = (payload) => {
  return {
    type: constants.SET_SETTINGS,
    payload,
  };
};

export const setRaceCard = (payload) => {
  return {
    type: constants.SET_RACE_CARD,
    payload,
  };
};

export const setCasinoCategory = (payload) => {
  return {
    type: constants.SET_CASINO_CATEGORY,
    payload,
  };
};

export const setPageLayoutContent = (payload) => {
  return {
    type: constants.SET_PAGE_LAYOUT_CONTENT,
    payload,
  };
};

export const updatePageLayoutContent = (payload) => {
  return {
    type: constants.UPDATE_PAGE_LAYOUT_CONTENT,
    payload,
  };
};

export const setSubscriptions = (payload) => {
  return {
    type: constants.SET_SUBSCRIPTIONS,
    payload,
  };
};

export const addToUpdatedBetslipSelections = (payload) => {
  return {
    type: constants.ADD_TO_UPDATED_BETSLIP_SELECTIONS,
    payload,
  };
};

export const setUpdatedBetslipSelections = (payload) => {
  return {
    type: constants.SET_UPDATED_BETSLIP_SELECTIONS,
    payload,
  };
};

export const upadateUserBalance = (payload) => {
  return {
    type: constants.UPDATE_USER_BALANCE,
    payload,
  };
};

export const setMarketOptions = (payload) => {
  return {
    type: constants.SET_MARKET_OPTIONS,
    payload,
  };
};

export const setFavouriteGames = (payload) => {
  return {
    type: constants.SET_FAVOURITE_GAMES,
    payload,
  };
};

export const addToFavouriteGames = (payload) => {
  return {
    type: constants.ADD_TO_FAVOURITE_GAMES,
    payload,
  };
};

export const removeFromFavouriteGames = (payload) => {
  return {
    type: constants.REMOVE_FROM_FAVOURITE_GAMES,
    payload,
  };
};

export const setCurrentTime = (payload) => {
  return {
    type: constants.SET_CURRENT_TIME,
    payload,
  };
};

export const setFooter = (payload) => {
  return {
    type: constants.SET_FOOTER,
    payload,
  };
};

export const setAlertModal = (payload) => {
  return {
    type: constants.SET_ALERT_MODAL,
    payload,
  };
};

export const setPrivacytModal = (payload) => {
  return {
    type: constants.SET_PRIVACY_MODAL,
    payload,
  };
};

export const setTermsModal = (payload) => {
  return {
    type: constants.SET_TERMS_MODAL,
    payload,
  };
};

export const setPromo = (payload) => {
  return {
    type: constants.SET_PROMO,
    payload,
  };
};

export const setPriceIsChanged = (payload) => {
  return {
    type: constants.SET_PRICE_IS_CHANGED,
    payload,
  };
};

export const destroySession = (payload) => {
  return {
    type: constants.DESTROY_SESSION,
    payload,
  };
};

export const setForgotPassword = (payload) => {
  return {
    type: constants.SET_FORGOT_PASSWORD,
    payload,
  };
};

export const setTooltip = (payload) => {
  return {
    type: constants.SET_TOOLTIP,
    payload,
  };
};

export const setIsVerifyMessage = (payload) => {
  return {
    type: constants.SET_IS_VERIFY_MESSAGE,
    payload,
  };
};

export const setHeaderNotification = (payload) => {
  return {
    type: constants.SET_HEADER_NOTIFICATION,
    payload,
  };
};

export const setReviewBets = (payload) => {
  return {
    type: constants.SET_REVIEW_BETS,
    payload,
  };
};

export const setUserStats = (payload) => {
  return {
    type: constants.SET_USER_STATS,
    payload,
  };
};

export const setUpdatedEvents = (payload) => {
  return {
    type: constants.SET_UPDATED_EVENTS,
    payload,
  };
};

export const addUpdatedEvents = (payload) => {
  return {
    type: constants.ADD_UPDATED_EVENTS,
    payload,
  };
};

export const setLoggedUserData = (payload) => {
  return {
    type: constants.SET_LOGGED_USER_DATA,
    payload,
  };
};

export const setFreeBetCreditSelect = (payload) => {
  return {
    type: constants.SET_FREE_BET_CREDIT_SELECT,
    payload,
  };
};

export const setNotifyCasinoSession = (payload) => {
  return {
    type: constants.SET_NOTIFY_CASINO_SESSION,
    payload,
  };
};

export const setSportFilters = (payload) => {
  return {
    type: constants.SET_SPORT_FILTERS,
    payload,
  };
};

export const addProviderSuspended = (payload) => {
  return {
    type: constants.ADD_PROVIDER_SUSPENDED,
    payload,
  };
};

export const removeProviderSuspended = (payload) => {
  return {
    type: constants.REMOVE_PROVIDER_SUSPENDED,
    payload,
  };
};
