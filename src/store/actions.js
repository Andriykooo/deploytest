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
export const setCountryPhone = (payload) => {
  return {
    type: constants.SET_COUNTRY_PHONE,
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

export const setSportData = (payload) => {
  return {
    type: constants.SPORT_DATA,
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

export const setUpdatedSelections = (payload) => {
  return {
    type: constants.SET_UPDATED_SELECTIONS,
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

export const setResultedEvents = (payload) => {
  return {
    type: constants.SET_RESULTED_EVENTS,
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

export const setErrorCode = (payload) => {
  return {
    type: constants.SET_ERROR_CODE,
    payload,
  };
};
