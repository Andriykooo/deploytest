export const fallbackLng = "en";

export const predictionsApiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
export const gamingApiDomain = process.env.NEXT_PUBLIC_GAMING_SOCKET_URL;
export const casinoApiDomain = process.env.NEXT_PUBLIC_CASINO_URL;

export const apiUrl = {
  // Predictions API
  CHECK_EMAIL: `${predictionsApiDomain}/v1/user/check_email`,
  SIGN_UP: `${predictionsApiDomain}/v1/user/full_signup`,
  FEEDBACK: `${predictionsApiDomain}/v1/feedback_website`,
  VERIFY_EMAIL: `${predictionsApiDomain}/v1/user/verify_email_full_profile?code=`,
  TRANSACTION_HISTORY: `${gamingApiDomain}/api/v1/user/transaction-history?page=`,
  // TRANSACTION_HISTORY: `${predictionsApiDomain}/v1/user/transaction_history?page=`,
  USER: `${predictionsApiDomain}/v1/user`,
  VERIFY_PHONE: `${predictionsApiDomain}/v1/user/verify_phone_number?code=`,
  CHECK_PASSWORD: `${predictionsApiDomain}/v1/user/auth`,
  RESEND_CODE: `${predictionsApiDomain}/v1/user/resend_phone_number_code`,
  RESEND_EMAIL: `${predictionsApiDomain}/v1/user/resend_otp`,
  RESET_PASSWORD: `${predictionsApiDomain}/v1/user/request_reset_password?email=`,
  SIGNIN_SOCIAL: `${predictionsApiDomain}/v1/user/signin_social`,
  COOKIE_POLICY: `${predictionsApiDomain}/v1/page_content?type=cookie-policy`,
  ABOUT_US: `${predictionsApiDomain}/v1/page_content?type=about-us`,
  URI_REFRESH_TOKEN: `${predictionsApiDomain}/v1/user/refresh_token`,
  SIGN_OUT: `${predictionsApiDomain}/v1/user/sign_out`,
  CHANGE_PASSWORD: `${predictionsApiDomain}/v1/user/change_password`,
  SETTING_OPTIONS: `${predictionsApiDomain}/v1/setting_options`,
  SETTINGS: `${predictionsApiDomain}/v1/user/settings`,
  PAGE_CONTENT: `${predictionsApiDomain}/v1/page_content`,
  KYC_TOKEN: `${predictionsApiDomain}/v1/user/kyc_access_token`,
  GET_NET_DEPOSIT_AMOUNT: `${predictionsApiDomain}/v1/user/net_deposit`,
  PREDICTIONS_HISTORY: `${predictionsApiDomain}/v1/bets/history`,
  CANCEL_BET: `${predictionsApiDomain}/v1/bets/cancel`,
  GET_PAYMENT_GATEWAY_LINK: `${predictionsApiDomain}/v1/payment_gateway/nixxe/deposit-link`,
  GET_WITHDRAW_GATEWAY_LINK: `${predictionsApiDomain}/v1/payment_gateway/nixxe/withdrawal-link`,
  PASSWORD_RESET: `${predictionsApiDomain}/v1/user/reset_password?token=`,
  RECONFIRM_DEPOSIT: `${predictionsApiDomain}/v1/user/reconfirm_action`,
  EMAIL_SENT: `${predictionsApiDomain}/v1/user/request_reset_password?device_type=web&&email=`,

  // Gaming API
  GET_FAVORITES: `${gamingApiDomain}/api/v1/games/favorite-games`,
  GET_COMPONENT: `${gamingApiDomain}/api/v1/page-layout/component`,
  GET_OFFER: `${gamingApiDomain}/api/v1/betting/bet-ticker`,
  GET_AFFILIATE_LINKS: `${gamingApiDomain}/api/v1/cms/affiliate-links`,
  BET_TICKER_LIST: `${gamingApiDomain}/api/v1/betting/bet-ticker-list`,
  TERMS: `${gamingApiDomain}/api/v1/cms/terms-conditions`,
  PRIVACY: `${gamingApiDomain}/api/v1/cms/privacy-policy`,
  GET_FOOTER: `${gamingApiDomain}/api/v1/page-layout/footer`,
  GET_SIDEBAR_LEFT: `${gamingApiDomain}/api/v1/page-layout/sidebar-left`,
  GET_SIDEBAR_RIGHT: `${gamingApiDomain}/api/v1/page-layout/sidebar-right`,
  GET_PAGE_LAYOUT: `${gamingApiDomain}/api/v1/page-layout`,
  GET_MAIN_MENU: `${gamingApiDomain}/api/v1/page-layout/main-menu`,
  GET_RACECARD: `${gamingApiDomain}/api/v1/page-layout/race-card`,
  GET_GAME: `${gamingApiDomain}/api/v1/games/details`,
  ADD_TO_FAVORITE_GAMES: `${gamingApiDomain}/api/v1/games/add-favorite`,
  REMOVE_FROM_FAVORITE_GAMES: `${gamingApiDomain}/api/v1/games/remove-favorite`,
  MATCH_DETAILS: `${gamingApiDomain}/api/v1/markets/selections-odds`,
  MARKETS: `${gamingApiDomain}/api/v1/markets/details`,
  GET_SPORT_TYPES: `${gamingApiDomain}/api/v1/sports/types`,
  GET_SPORT_CONTENT: `${gamingApiDomain}/api/v1/page-layout/sport-content`,
  GET_COMPETITIONS: `${gamingApiDomain}/api/v1/matches/competitions-matches-odds`,
  UPDATE_BET_STATUS: `${gamingApiDomain}/api/v1/betting/update-bet-offer-status`,
  GET_BET_SLIP: `${gamingApiDomain}/api/v1/betting/generate-bet-slips`,
  CASH_OUT: `${gamingApiDomain}/api/v1/betting/cash-out`,
  CASH_OUT_DETAILS: `${gamingApiDomain}/api/v1/betting/cash-out/details`,
  GET_GLOBAL_SEO: `${gamingApiDomain}/api/v1/cms/global-seo`,
  GET_CSS_CONTENT: `${gamingApiDomain}/api/v1/cms/css-style`,
  GET_SETTINGS: `${gamingApiDomain}/api/v1/cms/settings`,
  GET_MY_BETS: `${gamingApiDomain}/api/v1/betting/my-bets`,
  GET_VENUE_EVENTS: `${gamingApiDomain}/api/v1/page-layout/venue-events`,
  GET_AFFILIATES: `${gamingApiDomain}/api/v1/cms/landing-page`,
  ON_BOARDING: `${gamingApiDomain}/api/v1/cms/onboarding`,
  GET_BONUSES_PROMOTIONS: `${gamingApiDomain}/api/v1/betting/bonuses-promotions`,
  GET_FREE_BETS: `${gamingApiDomain}/api/v1/betting/free-credits`,
  MATCHES_SEARCH: `${gamingApiDomain}/api/v1/matches/search-events`,
  NOTIFICATION_BAR: `${gamingApiDomain}/api/v1/page-layout/notification-bar`,
  USER_STATS: `${gamingApiDomain}/api/v1/user/stats`,
  BILLING_ADDRESS: `${gamingApiDomain}/api/v1/user/billing-address`,

  // Casino API
  CASINO_GAMES: `${casinoApiDomain}/api/v1/casino/games`,
  OPEN_CASINO_GAME: `${casinoApiDomain}/api/v1/casino/game/open`,
  CASINO_LAYOUT: `${casinoApiDomain}/api/v1/casino/layout?slug=casino`,
  CLOSE_CASINO: `${casinoApiDomain}/api/v1/casino/game/close`,
  CONTINUE_CASINO: `${casinoApiDomain}/api/v1/casino/game/continue`,
  CLOSE_SESSIONS: `${casinoApiDomain}/api/v1/casino/game/close-sessions`,

  // Facebook graph
  GRAPH_FACEBOOK: "https://graph.facebook.com/v18.0/me",

  // Google
  GOOGLE_OAUTH_USERINFO: "https://www.googleapis.com/oauth2/v3/userinfo",
};

export const bonusesChipDates = [
  {
    id: 1,
    name: "available",
    value: false,
  },
  {
    id: 2,
    name: "last_30_days",
    value: true,
  },
];

export const phaseStatus = {
  IN_PLAY: "in_play",
  FINISHED: "finished",
  PRE_MATCH: "pre_match",
  ABANDONED: "abandoned",
};

export const prohibitedCharacters = ["e", "+", " "];

export const oddsFormatTypes = [
  {
    format: "decimal",
    id: "decimal",
  },
  {
    format: "fractional",
    id: "fractional",
  },
  // {
  //   format: "American",
  //   id: "american",
  // },
];

export const inPlayHomeMenu = [
  {
    name: "football",
  },
  {
    name: "golf",
  },
  {
    name: "cricket",
  },
  {
    name: "darts",
  },
  {
    name: "snooker",
  },
];

export const pushNotifications = [
  {
    title: "push_notifications",
    status: true,
    text: "sports_update_promotions",
    key: "sports_update_promotions",
  },
  { status: false, text: "bet_updates", key: "bet_updates" },
];
export const emailNotifications = [
  {
    title: "email_notifications",
    status: false,
    text: "marketing_promotional",
    key: "marketing_promotional",
  },
  { status: true, text: "news_and_updates", key: "news_and_updates" },
  { status: true, text: "bet_updates", key: "email_bet_updates" },
];

export const types = [
  {
    name: "selected",
    color: "var(--global-color-price-selected)",
  },
  {
    name: "price_going_out",
    color: "var(--global-color-price-drifting)",
  },
  {
    name: "price_coming_in",
    color: "var(--global-color-price-shortening)",
  },
  {
    name: "suspended",
    color: "var(--global-color-price-suspended)",
  },
];

export const eventAtSlider = [
  { page: "Leeds Rhinos", bet: "19/10" },
  { page: "Tie", bet: "19/10" },
  { page: "Catalans", bet: "19/10" },
];

export const multipleBetTypesInfo = {
  double: "double_bet_description",
  treble: "triple_bet_description",
  trixie: "trixie_bet_description",
  patent: "patent_bet_description",
  accumulator: "accumulator_bet_description",
  // fold: "accumulator_bet_description",
  yankee: "yankee_bet_description",
  lucky15: "lucky_15_bet_description",
  lucky31: "lucky_31_bet_description",
  lucky63: "lucky_63_bet_description",
  canadian: "canadian_bet_description",
  heinz: "heinz_bet_description",
  superheinz: "super_heinz_bet_description",
  goliath: "goliath_bet_description",
  forecast: "forecast_bet_description",
  tricast: "tricast_bet_description",
  reverse_forecast: "reverse_forecast_description",
  reverse_tricast: "reverse_tricast_description",
};

export const enableSidebarRoutes = [
  "/game-list",
  "/event",
  "/sport",
  "/racecard",
];

export const eventStatus = {
  WINNER: "winner",
  LOSER: "loser",
  PARTIAL: "partial",
  PUSHED: "pushed",
};

export const casinoSessionTypes = {
  CLOSE_CASINO_SESSION: "close_casino_session",
  NOTIFY_CASINO_SESSION: "notify_casino_session",
  CLOSE_ALL_CASINO_SESSIONS: "close_all_casino_session",
};

export const racingRegionFilters = {
  ALL: "all",
  UK_IRELAND: "uk_ireland",
  INTERNATIONAL: "international",
};

export const stakeLimit = 1000000;
