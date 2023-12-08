import { theme } from "./config";
import {
  BetHistoryIcon,
  ChangePasswordIcon,
  CreditCardLogoOfFooter,
  DepositIcon,
  FastestPayoutsIcon,
  Games,
  LiveBettingIcon,
  LiveIconOfFooter,
  NetDepositIcon,
  NotificationsIcon,
  OddsBoostIcon,
  OddsFormatIcon,
  ProfileMenuIcon,
  SaferGamblingIcon,
  SpeedLogoOfFooter,
  TransactionIcon,
  WithdrawIcon,
} from "./icons";
import { images } from "./imagesConstant";

export const fallbackLng = "en";

export const predictionsApiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
export const gamingApiDomain = process.env.NEXT_PUBLIC_GAMING_SOCKET_URL;
export const casinoApiDomain = process.env.NEXT_PUBLIC_CASINO_URL;

export const apiUrl = {
  // Predictions API
  CHECK_EMAIL: `${predictionsApiDomain}/v1/user/check_email`,
  SIGN_UP: `${predictionsApiDomain}/v1/user/full_signup`,
  ON_BOARDING: `${predictionsApiDomain}/v1/onboarding`,
  FEEDBACK: `${predictionsApiDomain}/v1/feedback_website`,
  VERIFY_EMAIL: `${predictionsApiDomain}/v1/user/verify_email_full_profile?code=`,
  TRANSACTION_HISTORY: `${predictionsApiDomain}/v1/user/transaction_history?page=`,
  USER: `${predictionsApiDomain}/v1/user`,
  USER_STATS: `${predictionsApiDomain}/v1/user/stats`,
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
  GET_COMPETITIONS: `${gamingApiDomain}/api/v1/matches/competitions-matches-odds`,
  UPDATE_BET_STATUS: `${gamingApiDomain}/api/v1/betting/update-bet-offer-status`,
  GET_BET_SLIP: `${gamingApiDomain}/api/v1/betting/generate-bet-slips`,
  CASH_OUT: `${gamingApiDomain}/api/v1/betting/cash-out`,
  GET_GLOBAL_SEO: `${gamingApiDomain}/api/v1/cms/global-seo`,
  GET_CSS_CONTENT: `${gamingApiDomain}/api/v1/cms/css-style`,
  GET_SETTINGS: `${gamingApiDomain}/api/v1/cms/settings`,
  GET_MY_BETS: `${gamingApiDomain}/api/v1/betting/my-bets`,
  GET_VENUE_EVENTS: `${gamingApiDomain}/api/v1/page-layout/venue-events`,
  GET_AFFILIATES: `${gamingApiDomain}/api/v1/cms/landing-page`,

  // Casino API
  CASINO_GAMES: `${casinoApiDomain}/api/v1/casino/games`,
  OPEN_CASINO_GAME: `${casinoApiDomain}/api/v1/casino/game/open`,
  CASINO_LAYOUT: `${casinoApiDomain}/api/v1/casino/layout?slug=casino`,

  // Facebook graph
  GRAPH_FACEBOOK: "https://graph.facebook.com/v18.0/me",

  // Google
  GOOGLE_OAUTH_USERINFO: "https://www.googleapis.com/oauth2/v3/userinfo",
};

export const sports = [
  { icons: images.union, sportsType: "Sports", route: "/sport" },
  { icons: images.inPlay, sportsType: "In-Play", route: "/inplay" },
  { icons: images.casino, sportsType: "Casino", route: "/casino" },
  {
    icons: images.liveCasino,
    sportsType: "Live Casino",
    route: "/live_casino",
  },
];
export const monthDates = [
  { month: "march", year: "2023" },
  { month: "february", year: "2023" },
  { month: "january", year: "2023" },
  { month: "december", year: "2023" },
  { month: "november", year: "2022" },
  { month: "october", year: "2022" },
  { month: "september", year: "2022" },
  { month: "august", year: "2022" },
  { month: "july", year: "2022" },
  { month: "june", year: "2022" },
  { month: "may", year: "2022" },
  { month: "april", year: "2022" },
];

export const profileCards = [
  // TODO: Add bonuses promotions page
  // {
  //   cardName: "bonuses_promotions",
  //   icon: <BonusesAndPromotionsIcon />,
  //   route: "/profile/bonuses_promotions",
  //   text: "bonuses_promotions",
  //   buttonText: "New",
  //   arrow: true,
  // },
  {
    cardName: "profile",
    icon: <ProfileMenuIcon />,
    route: "/profile/profile",
    text: "profile",
    arrow: false,
  },
  {
    cardName: "safer_gambling",
    icon: <SaferGamblingIcon />,
    route: "/profile/safer_gambling",
    text: "safer_gambling",
    arrow: false,
  },
  {
    cardName: "deposit",
    icon: <DepositIcon />,
    route: "/profile/deposit",
    text: "deposit",
    arrow: true,
  },
  {
    cardName: "withdraw",
    icon: <WithdrawIcon />,
    route: "/profile/withdraw",
    text: "withdraw",
    arrow: true,
  },
  {
    cardName: "bet_history",
    icon: <BetHistoryIcon />,
    route: "/profile/bet_history",
    text: "bet_history",
    arrow: true,
  },
  {
    cardName: "transaction_history",
    icon: <TransactionIcon />,
    route: "/profile/transaction_history",
    text: "transaction_history",
    arrow: true,
  },
  {
    cardName: "net_deposit",
    icon: <NetDepositIcon />,
    route: "/profile/net_deposit",
    text: "net_deposit",
    arrow: true,
  },
  {
    cardName: "change_password",
    icon: <ChangePasswordIcon />,
    route: "/profile/change_password",
    text: "change_password",
    arrow: false,
  },
  {
    cardName: "notifications",
    icon: <NotificationsIcon />,
    route: "/profile/notifications",
    text: "notifications",
    arrow: false,
  },
  {
    cardName: "odds_format",
    icon: <OddsFormatIcon />,
    route: "/profile/odds_format",
    text: "odds_format",
    arrow: false,
  },
];

export const predictionPages = [
  {
    cardName: "open",
    image: images.openBets,
    route: "/profile/open_predictions",
    text: "open_predictions",
  },
  {
    cardName: "settled",
    image: images.settledBets,
    route: "/profile/settled_predictions",
    text: "settled_predictions",
  },
];

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

export const casinoMenu = [
  { name: "Home" },
  { name: "Favorite Games" },
  {
    name: "Popular Games",
  },
  {
    name: "New Games",
  },
  {
    name: "Slots",
  },
  {
    name: "Megaways",
  },
  {
    name: "Game Providers",
  },
];

export const swiftyMenuSpecial = [
  {
    name: "All Sports",
  },
  {
    name: "Football",
  },
  {
    name: "Horse Racing",
  },
  {
    name: "Ice Hockey",
  },
  {
    name: "Basketball",
  },
];

export const horseRacingHomeMenu = [
  {
    name: "today",
  },
  {
    name: "tomorrow",
  },
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

export const depositAmounts = [10, 20, 50, 100, 200, 500];

export const depositAmountsOnMobile = [10, 20, 30, 40, 50];

export const depositSteps = {
  limit: "limit",
  amount: "amount",
  deposit: "deposit",
};

export const subscribePages = ["/inplay", "/match"];

export const ContactList = [
  { route: "/about_us", text: " About us ", modal: "about_us" },
  { route: "/#", text: " Affiliate Program ", modal: "" },
  { route: "/contact", text: " Contact Us ", modal: "contact_us" },
];

export const returnSaferBettingRulesList = (loggedUser) => {
  return [
    { route: "#", text: " FAQ " },
    {
      route: loggedUser ? "/profile/safer_gambling" : "/login",
      text: " Safer Gambling ",
    },
    {
      route: loggedUser ? "/profile/safer_gambling_information" : "/login",
      text: " Betting Rules ",
    },
  ];
};

export const TermsAndPrivacyList = [
  { route: "/privacy", text: " Privacy Policy ", modal: "privacy" },
  { route: "/terms", text: " Terms & Conditions ", modal: "terms" },
  { route: "/cookie", text: " Cookie Policy ", modal: "cookie" },
];

export const socialsList = [
  {
    route: "https://twitter.com/SwiftyGlobal",
    target: "_blank",
    text: "  Twitter ",
  },
  {
    route: "https://www.instagram.com/swiftyglobal/",
    target: "_blank",
    text: " Instagram",
  },
  {
    route: "https://www.linkedin.com/company/swifty-global",
    target: "_blank",
    text: " Linkedin ",
  },
];

export const homeEvents = [
  "In Play",
  "Top Events",
  "Starting Soon",
  "Specials",
];

export const betGroupLinks = [
  {
    name: "live_betting",
    icon: <LiveBettingIcon />,
  },
  {
    name: "odds_boost",
    icon: <OddsBoostIcon />,
  },
  {
    name: "fastest_payouts",
    icon: <FastestPayoutsIcon />,
  },
  {
    name: "online_casino",
    icon: <Games background={theme?.colors?.mainTertiary} />,
  },
];
export const homeMarkets = [
  {
    favorite: 1,
    market_id: "2",
    market_name: "In Play",
    selections: [
      { selection_id: "1", selection_name: "Home" },
      { selection_id: "2", selection_name: "Draw" },
      { selection_id: "3", selection_name: "Away" },
    ],
  },
  {
    favorite: 1,
    market_id: "3",
    market_name: "Top Events",
    selections: [
      { selection_id: "1", selection_name: "Home" },
      { selection_id: "2", selection_name: "Draw" },
      { selection_id: "3", selection_name: "Away" },
    ],
  },
  {
    favorite: 1,
    market_id: "4",
    market_name: "Starting Soon",
    selections: [
      { selection_id: "1", selection_name: "Home" },
      { selection_id: "2", selection_name: "Draw" },
      { selection_id: "3", selection_name: "Away" },
    ],
  },
  {
    favorite: 1,
    market_id: "5",
    market_name: "Specials",
    selections: [
      { selection_id: "1", selection_name: "Home" },
      { selection_id: "2", selection_name: "Draw" },
      { selection_id: "3", selection_name: "Away" },
    ],
  },
];

export const sportsData = {
  Football: {
    leagues: [
      { id: 1, league: "Israel Liga Alef South" },
      { id: 2, league: "Portugal Liga Revelacao U23" },
      { id: 3, league: "International Test Match" },
      { id: 4, league: "Thailand League 1" },
      { id: 5, league: "Global Test Match" },
    ],
    bets: [
      { id: 1, bet: "Home" },
      { id: 2, bet: "Draw" },
      { id: 3, bet: "Away" },
    ],
    odds: [
      { id: 1, odd: "18/4" },
      { id: 2, odd: "25/6" },
      { id: 3, odd: "2/5" },
    ],
    games: [
      {
        id: 1,
        time: "90'+",
        homeTeam: "Hapoel Bikat Hayarden",
        awayTeam: "Maccabi Yavne",
        league: "Israel Liga Alef South",
      },
      {
        id: 2,
        time: "45'+",
        homeTeam: "Muang Thong United",
        awayTeam: "Lamphur Warrior",
        league: "Israel Liga Alef South",
      },
      {
        id: 3,
        time: "45'+",
        homeTeam: "Leixoes SC U23",
        awayTeam: "AC Milan",
        league: "Portugal Liga Revelacao U23",
      },
      // Add more games here
    ],
  },
  Tennis: {
    leagues: [
      { id: 1, league: "ATP Estoril" },
      { id: 2, league: "ATP Marrakech" },
      { id: 3, league: "Challenger Barletta" },
      { id: 4, league: "Challenger Murcia" },
    ],
    bets: [
      { id: 1, bet: "Player 1" },
      { id: 2, bet: "Player 2" },
    ],
    odds: [
      { id: 1, odd: "25/6" },
      { id: 2, odd: "2/5" },
    ],

    games: [
      {
        id: 1,
        time: "Live",
        homeTeam: "Astros",
        awayTeam: "Yankees",
        league: "ATP Estoril",
      },
      {
        id: 2,
        time: "Live",
        homeTeam: "Dodgers",
        awayTeam: "Mets",
        league: "ATP Estoril",
      },
      // Add more games here
    ],
  },

  Boxing: {
    leagues: [
      { id: 1, league: "ATP Estoril" },
      { id: 2, league: "ATP Marrakech" },
      { id: 3, league: "Challenger Barletta" },
      { id: 4, league: "Challenger Murcia" },
    ],
    bets: [
      { id: 1, bet: "Player 1" },
      { id: 2, bet: "Player 2" },
    ],
    odds: [
      { id: 1, odd: "25/6" },
      { id: 2, odd: "2/5" },
    ],

    games: [
      {
        id: 1,
        time: "Live",
        homeTeam: "Astros",
        awayTeam: "Yankees",
        league: "ATP Estoril",
      },
      {
        id: 2,
        time: "Live",
        homeTeam: "Dodgers",
        awayTeam: "Mets",
        league: "ATP Estoril",
      },
      // Add more games here
    ],
  },

  Cricket: {
    leagues: [
      { id: 1, league: "ATP Estoril" },
      { id: 2, league: "ATP Marrakech" },
      { id: 3, league: "Challenger Barletta" },
      { id: 4, league: "Challenger Murcia" },
    ],
    bets: [
      { id: 1, bet: "Player 1" },
      { id: 2, bet: "Player 2" },
    ],
    odds: [
      { id: 1, odd: "25/6" },
      { id: 2, odd: "2/5" },
    ],

    games: [
      {
        id: 1,
        time: "Live",
        homeTeam: "Astros",
        awayTeam: "Yankees",
        league: "ATP Estoril",
      },
      {
        id: 2,
        time: "Live",
        homeTeam: "Dodgers",
        awayTeam: "Mets",
        league: "ATP Estoril",
      },
      // Add more games here
    ],
  },
};

export const eventAtSlider = [
  { page: "Leeds Rhinos", bet: "19/10" },
  { page: "Tie", bet: "19/10" },
  { page: "Catalans", bet: "19/10" },
];

export const liveGamesData = [
  {
    icon: <SpeedLogoOfFooter />,
    title: "Faster Withdrawal",
    text: "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem.",
  },
  {
    icon: <LiveIconOfFooter />,
    title: "Live Streaming",
    text: "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem.",
  },
  {
    icon: <CreditCardLogoOfFooter />,
    title: "Odds Boost",
    text: "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem.",
  },
];

export const popularCasinoGames = [
  images.royalCasino,
  images.bigcatkino,
  images.gemie,
  images.gorillaGold,
  images.jackpot,
  images.bigcatkino,
  images.bigcatkino,
  images.gemie,
  images.gorillaGold,
  images.jackpot,
  images.bigcatkino,
];

export const multipleBetTypesInfo = {
  double: "double_bet_description",
  treble: "triple_bet_description",
  trixie: "trixie_bet_description",
  patent: "patent_bet_description",
  accumulator: "accumulator_bet_description",
  fold: "accumulator_bet_description",
  yankee: "yankee_bet_description",
  lucky15: "lucky_15_bet_description",
  lucky31: "lucky_31_bet_description",
  lucky63: "lucky_63_bet_description",
  canadian: "canadian_bet_description",
  heinz: "heinz_bet_description",
  superheinz: "super_heinz_bet_description",
  goliath: "goliath_bet_description",
};
