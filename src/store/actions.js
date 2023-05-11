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

export const selectBet = (payload) => {
  return {
    type: constants.SELECT_BET,
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

export const setActiveSocketSubscribe = (payload) => {
  return {
    type: constants.ACTIVE_SOCKET_SUBSCRIBE,
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
