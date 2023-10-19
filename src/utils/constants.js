import pointer from "../assets/images/pointer.svg";
import { theme } from "./config";
import {
  CreditCardLogoOfFooter,
  FastestPayoutsIcon,
  Games,
  LiveBettingIcon,
  LiveIconOfFooter,
  OddsBoostIcon,
  SpeedLogoOfFooter,
} from "./icons";
import { images } from "./imagesConstant";

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

  // Casino API
  CASINO_GAMES: `${casinoApiDomain}/api/v1/casino/games`,
  OPEN_CASINO_GAME: `${casinoApiDomain}/api/v1/casino/game/open`,
  CASINO_LAYOUT: `${casinoApiDomain}/api/v1/casino/layout?slug=casino`,
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
  { month: "March", year: "2023" },
  { month: "February", year: "2023" },
  { month: "January", year: "2023" },
  { month: "December", year: "2023" },
  { month: "November", year: "2022" },
  { month: "October", year: "2022" },
  { month: "September", year: "2022" },
  { month: "August", year: "2022" },
  { month: "July", year: "2022" },
  { month: "June", year: "2022" },
  { month: "May", year: "2022" },
  { month: "April", year: "2022" },
];

export const profileCards = [
  {
    cardName: "Bonuses & Promotions",
    image: images.bonusesAndPromotionsIcon,
    route: "/profile/bonuses_promotions",
    text: "bonuses_promotions",
    buttonText: "New",
    arrow: true,
  },
  {
    cardName: "Deposit",
    image: images.depositIcon,
    route: "/profile/deposit",
    text: "deposit",
    arrow: true,
  },
  {
    cardName: "Withdraw",
    image: images.withdrawIcon,
    route: "/profile/withdraw",
    text: "withdraw",
    arrow: true,
  },
  {
    cardName: "Bet History",
    image: images.predictionIcon,
    route: "/profile/bet_history",
    text: "bet_history",
    arrow: true,
  },
  {
    cardName: "Transaction History",
    image: images.transactionIcon,
    route: "/profile/transaction_history",
    text: "transaction_history",
    arrow: true,
  },
  {
    cardName: "Net Deposit",
    image: images.netDepositIcon,
    route: "/profile/net_deposit",
    text: "net_deposit",
    arrow: true,
  },
  {
    cardName: "Profile",
    image: images.profileMenuIcon,
    route: "/profile/profile",
    text: "profile",
    arrow: false,
  },
  {
    cardName: "Notifications",
    image: images.notificationsIcon,
    route: "/profile/notifications",
    text: "notifications",
    arrow: false,
  },
  {
    cardName: "Odds Format",
    image: images.oddsIcon,
    route: "/profile/odds_format",
    text: "odds_format",
    arrow: false,
  },
  {
    cardName: "Safer Gambling",
    image: images.saferGamblingIcon,
    route: "/profile/safer_gambling",
    text: "safer_gambling",
    arrow: false,
  },
];

export const predictionPages = [
  {
    cardName: "Open",
    image: images.openBets,
    route: "/profile/open_predictions",
    text: "open_predictions",
  },
  {
    cardName: "Settled",
    image: images.settledBets,
    route: "/profile/settled_predictions",
    text: "settled_predictions",
  },
];

export const predictions = [
  {
    bet: "Manchester United to win (FT)",
    stake: "200",
    returns: "3200",
    odds: "3.2",
  },
  {
    bet: "Manchester United to draw (FT)",
    stake: "150",
    returns: "3200",
    odds: "3.7",
  },
];
export const settledPredictions = [
  {
    bet: "Manchester United to win (FT)",
    stake: "200",
    returns: "3200",
    odds: "3.2",
    betResult: "Loss",
    class: "lossButton",
  },
  {
    bet: "Manchester United to draw (FT)",
    stake: "150",
    returns: "3200",
    odds: "3.7",
    betResult: "Win",

    class: "winButton",
  },
];
export const oddsFormatTypes = [
  {
    format: "Decimal",
    id: "decimal",
  },
  {
    format: "Fractional",
    id: "fractional",
  },
  // {
  //   format: "American",
  //   id: "american",
  // },
];

export const sportsTypes = [
  {
    cardLabel: "Search",
    image: images.search,
    route: "",
    text: "search",
    arrow: false,
  },
  {
    cardLabel: "American Football",
    image: images.americanFootball,
    route: "",
    text: "american_football",
    arrow: false,
  },
  {
    cardLabel: "Basketball",
    image: images.basketball,
    route: "",
    text: "basketball",
    arrow: false,
  },
  {
    cardLabel: "Boxing",
    image: images.boxing,
    route: "",
    text: "boxing",
    arrow: false,
  },
  {
    cardLabel: "Cricket",
    image: images.cricket,
    route: "",
    text: "cricket",
    arrow: false,
  },
  {
    cardLabel: "Darts",
    image: images.darts,
    route: "",
    text: "darts",
    arrow: false,
  },
  {
    cardLabel: "Football",
    image: images.football,
    route: "",
    text: "football",
    arrow: false,
  },
  {
    cardLabel: "Golf",
    image: images.golf,
    route: "",
    text: "golf",
    arrow: false,
  },
  {
    cardLabel: "Greyhound Racing",
    image: images.greyHound,
    route: "",
    text: "greyhound",
    arrow: false,
  },
  {
    cardLabel: "Horse Racing",
    image: images.horseRacing,
    route: "",
    text: "horse_racing",
    arrow: false,
  },
  {
    cardLabel: "Ice Hockey",
    image: images.iceHockey,
    route: "/ice_hockey",
    text: "ice_hockey",
    arrow: false,
  },
  {
    cardLabel: "Mixed Martial Arts",
    image: images.martialArts,
    route: "",
    text: "martial_arts",
    arrow: false,
  },
  {
    cardLabel: "Snooker",
    image: images.snooker,
    route: "",
    text: "snooker",
    arrow: false,
  },
  {
    cardLabel: "Tennis",
    image: images.tennis,
    route: "",
    text: "tennis",
    arrow: false,
  },
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
    name: "Today",
  },
  {
    name: "Tomorrow",
  },
];

export const inPlayHomeMenu = [
  {
    name: "Football",
  },
  {
    name: "Golf",
  },
  {
    name: "Cricket",
  },
  {
    name: "Darts",
  },
  {
    name: "Snooker",
  },
];

export const pushNotifications = [
  {
    title: "Push Notifications",
    status: true,
    text: "Sport updates and promotions",
    key: "sports_update_promotions",
  },
  { status: false, text: "Bet updates", key: "bet_updates" },
];
export const emailNotifications = [
  {
    title: "Email Notifications",
    status: false,
    text: "Marketing and promotional",
    key: "marketing_promotional",
  },
  { status: true, text: "News and updates", key: "news_and_updates" },
  { status: true, text: "Bet updates", key: "email_bet_updates" },

];

export const types = [
  {
    name: "Selected",
    color: "var(--global-color-tertiary)",
  },
  {
    name: "Price going out (Drifting) ",
    color: "var(--global-color-price-drifting)",
  },
  {
    name: "Price coming in (Shortening)",
    color: "var(--global-color-price-shortening)",
  },
  {
    name: "Suspended",
    color: "var(--global-color-shade4)",
  },
];

export const depositAmounts = [10, 20, 50, 100, 200, 500]

export const depositAmountsOnMobile = [10, 20, 30, 40, 50]

export const depositSteps = {
  limit: 'limit',
  amount: 'amount',
  deposit: 'deposit'
}

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
    name: "LIVE-BETTING",
    icon: <LiveBettingIcon />,
  },
  {
    name: "ODDS BOOST",
    icon: <OddsBoostIcon />,
  },
  {
    name: "FASTEST PAYOUTS",
    icon: <FastestPayoutsIcon />,
  },
  {
    name: "ONLINE CASINO",
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

export const slides = [
  {
    icon: images.wolfLegend,
  },
  {
    icon: images.jewelTwist,
  },
  {
    icon: images.gorillaGold2,
  },
  {
    icon: images.wishJackpot,
  },
  {
    icon: images.gewieJackpot,
  },
  {
    icon: images.castleTerror,
  },
];

export const sliderImagesHomepage = [
  {
    subtitle: "Starts 06:45 PM",
    details: { title: "FA CUP BONUS", image: images.secondLogoOfSoccer },
    buttons: [
      {
        name: "FCB 9/4",
      },
      {
        name: "MAN UTD 8/13",
      },
    ],
  },
  {
    subtitle: "Starts 06:45 PM",
    details: { title: "FA CUP BONUS", image: images.secondLogoOfSoccer },
    buttons: [
      {
        name: "FCB 9/4",
      },
      {
        name: "MAN UTD 8/13",
      },
    ],
  },
  {
    subtitle: "Starts 06:45 PM",
    details: { title: "FA CUP BONUS", image: images.secondLogoOfSoccer },
    buttons: [
      {
        name: "FCB 9/4",
      },
      {
        name: "MAN UTD 8/13",
      },
    ],
  },
  {
    subtitle: "Starts 06:45 PM",
    details: { title: "FA CUP BONUS", image: images.secondLogoOfSoccer },
    buttons: [
      {
        name: "FCB 9/4",
      },
      {
        name: "MAN UTD 8/13",
      },
    ],
  },
  {
    subtitle:
      "Amad Diallo & Aleksandar Mitrovic BOTH score anytime (ENHANCE from 15/2)",
    details: { title: "FA CUP BONUS", image: images.secondLogoOfSoccer },

    buttons: [
      {
        name: "Bet Now",
      },
    ],
  },
  {
    subtitle:
      " We are paying an extra place in the 16.10 Southwell, 16.20 Fairyhouse & 8.30 Kempton",
    details: { title: "FA CUP BONUS", image: images.secondLogoOfSoccer },
    buttons: [
      {
        name: "Free Bet",
      },
    ],
  },
  {
    subtitle:
      "Jelen Hurts & Patrick Mahomes BOTH to Score (Rush or Recieve) a Touchdown at Any Time",
    details: {
      title: "SUPER BOWL SPECIALS",
      image: images.secondLogoOfSoccer,
    },
    buttons: [
      {
        name: "Bet Now",
      },
    ],
  },
];

export const sliderCasinoMenu = [
  {
    icon: images.hanaberoCasinoIcon,
    title: "HABANERO",
    description: "Play the Tavern of the Dead and other great games!",
    buttons: [
      {
        name: "Play now",
      },
    ],
  },
  {
    icon: images.mascotGameCasino,
    title: "MASCOT GAMES",
    description: "Play Robin of Loxley and other great games!",
    buttons: [
      {
        name: "Play now",
      },
    ],
  },
  {
    icon: images.vasiliLogoCasino,
    title: "YGGDRASIL GAMES",
    description: "Play the Tavern of the Dead and other great games!",
    buttons: [
      {
        name: "Play now",
      },
    ],
  },
  {
    icon: images.hanaberoCasinoIcon,
    title: "YGGDRASIL GAMES",
    description:
      "Jelen Hurts & Patrick Mahomes BOTH to Score (Rush or Recieve) a Touchdown at Any Time",
    buttons: [
      {
        name: "Play now",
      },
    ],
  },
];
export const sliderFavorites = [
  {
    icon: images.fisrtLogoTrending,
    title: "",
    description: "",
  },
  {
    icon: images.secondLogoTrending,
    title: "",
    description: "",
  },
  {
    icon: images.thirdLogoTrending,
    title: "",
    description: "",
  },
  {
    icon: images.fourthLogoTrending,
    title: "",
    description: "",
  },
  {
    icon: images.fifthLogoTrending,
    title: "",
    description: "",
  },

  {
    icon: images.fisrtLogoTrending,
    title: "",
    description: "",
  },
  {
    icon: images.secondLogoTrending,
    title: "",
    description: "",
  },
  {
    icon: images.thirdLogoTrending,
    title: "",
    description: "",
  },
  {
    icon: images.fourthLogoTrending,
    title: "",
    description: "",
  },
];

export const iconsAtTheSlider = [
  { icon: images.bigcatkino },
  { icon: images.gemie },
  { icon: images.gorillaGold },
  { icon: images.jackpot },
  { icon: images.bigcatkino },
];

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

export const FooterIconsSafeGambling = [
  { icon: images.beAware, alt: "Be gamble aware" },
  { icon: images.gamStop, alt: "Gamstop" },
  { icon: images.bet18, alt: "bet18+" },
  { icon: images.iBas, alt: "ibas icon" },
  { icon: images.gamCare, alt: "gamcare" },
];

export const newsGames = [
  images.wolfLegend,
  images.jewelTwist,
  images.gorillaGold2,
  images.wishJackpot,
  images.gewieJackpot,
  images.castleTerror,
  images.gewieJackpot,
  images.castleTerror,
];

export const recommendedData = [
  { gameImages: images.wolfLegend },
  { gameImages: images.jewelTwist },
  { gameImages: images.gorillaGold2 },
  { gameImages: images.wishJackpot },
  { gameImages: images.gewieJackpot },
  { gameImages: images.castleTerror },
  { gameImages: images.gewieJackpot },
  { gameImages: images.castleTerror },
];

export const liveCasinoData = [
  { gameImages: images.bigBass },
  { gameImages: images.finalCountdown },
  { gameImages: images.catKing },
  { gameImages: images.hotRepeater },
  { gameImages: images.bankinBacon },
  { gameImages: images.sinful7 },
  { gameImages: images.bigBass },
  { gameImages: images.finalCountdown },
];

export const trendingData = [
  { gameImages: images.firstTrending },
  { gameImages: images.secondTrending },
  { gameImages: images.thirdTrending },
  { gameImages: images.fourthTrending },
  { gameImages: images.firstTrending },
  { gameImages: images.secondTrending },
  { gameImages: images.thirdTrending },
  { gameImages: images.fourthTrending },
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

export const eventsOfHomepage = [
  {
    text: "Ismaila Sarr & Joao Pedro - Both to score at any time",
    odds: "11/1",
  },
  {
    text: "Event 2",
    odds: "9/1",
  },
  {
    text: "Event 3",
    odds: "7/1",
  },
  {
    text: "Event 4",
    odds: "5/1",
  },
  {
    text: "Event 5",
    odds: "3/1",
  },
];
export const eventsData = [
  {
    title: "Watford vs West Brom Price Boost",
    time: "16:45",
    specials: [
      {
        text: "Ismaila Sarr & Joao Pedro - Both to score at any time",
        odds: "11/1",
      },
      {
        text: "Ismaila Sarr & Joao Pedro - Both to score at any time",
        odds: "11/1",
      },
      {
        text: "Ismaila Sarr & Joao Pedro - Both to score at any time",
        odds: "11/1",
      },
    ],
  },
  {
    title: "Eintracht Frankfurt vs Napoli Price Boosts",
    time: "13:20",
    specials: [
      {
        text: "Over 3.5 goals in the game",
        odds: "11/1",
      },
      {
        text: "Randal Kolo Muani to asisst a goal",
        odds: "15/1",
      },
      {
        text: "A goal scored in the first 10 minutes ",
        odds: "20/1",
      },
    ],
  },
];
export const titlePerRow = [
  {
    id: 1,
    titleRow: "Carlise 14:35",
    underTitle: "2m 1f | EW 1/5 1-2-3",
    bet: "6/4",
  },
  {
    id: 2,
    titleRow: "Carlise 14:35",
    underTitle: "2m 1f | EW 1/5 1-2-3",
    bet: "6/4",
  },
  {
    id: 3,
    titleRow: "Carlise 14:35",
    underTitle: "2m 1f | EW 1/5 1-2-3",
    bet: "6/4",
  },
  {
    id: 4,
    titleRow: "Carlise 14:35",
    underTitle: "2m 1f | EW 1/5 1-2-3",
    bet: "6/4",
  },
];

export const matches = [
  {
    homeTeam: "Home Team 1",
    author: "Tristan Durell / D Skelton",
    bet: "6/4",
  },
  {
    homeTeam: "Home Team 2",
    author: "J E Moore / G L Moore",
    bet: "9/2",
  },
  {
    homeTeam: "Home Team 3",
    author: "Nick Scholfield / R Hobson",
    bet: "16/1",
  },
  {
    homeTeam: "Home Team 4",
    author: "Author 4",
    bet: "6/4",
  },
  {
    homeTeam: "Home Team 5",
    author: "Author 5",
    bet: "9/2",
  },
  {
    homeTeam: "Home Team 6",
    author: "Author 6",
    bet: "16/1",
  },
  {
    homeTeam: "Home Team 7",
    author: "Author 7",
    bet: "6/4",
  },
  {
    homeTeam: "Home Team 8",
    author: "Author 8",
    bet: "9/2",
  },
  {
    homeTeam: "Home Team 9",
    author: "Author 9",
    bet: "16/1",
  },
];

export const countries = [
  {
    city: "Limerick",
    countryItem: [
      { time: "04:00" },
      { time: "05:00" },
      { time: "06:00" },
      { time: "07:00" },
      { time: "08:00" },
      { time: "09:00" },
      { time: "" },
    ],
  },
  {
    city: "Newcastle",
    countryItem: [
      { time: "10:00" },
      { time: "11:00" },
      { time: "12:00" },
      { time: "13:00" },
      { time: "14:00" },
      { time: "" },
      { time: "" },
    ],
  },
  {
    city: "Ffos Las",
    countryItem: [
      { time: "16:00", pointer: pointer },
      { time: "17:00", pointer: pointer },
      { time: "18:00", pointer: null },
      { time: "19:00" },
      { time: "20:00" },
      { time: "" },
      { time: "" },
    ],
  },
  {
    city: "Southwell",
    countryItem: [
      { time: "22:00" },
      { time: "23:00" },
      { time: "00:00" },
      { time: "01:00" },
      { time: "02:00" },
      { time: "" },
      { time: "" },
    ],
  },
];

export const multipleBetTypesInfo = {
  double:
    "A single bet on two outcomes in different events. Both selections must be successful to have a return.",
  treble:
    "A single bet on three outcomes in different events. All three selections must win to guarantee a return.",
  trixie:
    "A bet comprising three selections and four bets – three doubles and a treble. A minimum of two selections must win to guarantee a return. For example, a £2.50 Trixie would cost £10. A £2.50 each-way Trixie would cost £20.",
  patent:
    "A bet involving three selections and seven bets – three singles, three doubles and one treble. It is the equivalent of a Trixie but with the addition of three singles. For example, a £2.50 Patent would cost £17.50.",
  accumulator:
    "An accumulator comprises of four or more selections in one bet. All of the selections must win to guarantee a return.",
  fold: "An accumulator comprises of four or more selections in one bet. All of the selections must win to guarantee a return.",
  yankee:
    "A bet consisting of four selections and 11 bets – six doubles, four trebles and a fourfold. A minimum of two selections must win to guarantee you a return. For example, a £2 Yankee would cost £22.",
  lucky15:
    "A popular betting type among punters, it consists of four selections and 15 bets (hence the name) – four singles, six doubles, four trebles and a fourfold. Equivalent to a Yankee but with four singles, and only one selection must win to guarantee you a return. For example, a £2 Lucky 15 would cost £30.",
  lucky31:
    "A wager consisting of five selections and 31 bets – five singles, ten doubles, ten trebles, five fourfolds, and one fivefold. Only one selection must win to guarantee you a return. For example, a £1 Lucky 31 would cost £31.",
  lucky63:
    "A Lucky 63 is a bet featuring six selections and 63 bets, including: six singles, 15 doubles, 20 trebles, 15 fourfolds, six fivefolds and one sixfold.",
  canadian:
    "Also known as a Super Yankee, a Canadian is a bet on five selections consisting of 26 bets – ten doubles, ten trebles, five fourfold’s and a five-fold accumulator.",
  heinz:
    "The Heinz bet is a six-selection bet consisting of 57 bets: 15 doubles, 20 trebles, 15 fourfolds, six fivefolds and a one sixfold accumulator. Aptly named after the 57 ‘varieties’ company slogan from Heinz, this 57 bet wager is a unique bet that combines every permutation of the 6 selections into one single wager.",
  superheinz:
    "The Super Heinz is a bet on seven selections taking part in various events consisting of 21 doubles, 35 trebles, 35 fourfolds, 21 fivefolds, seven sixfolds, and a sevenfold accumulator which totals a huge 120 bets. Two selections must win to ensure any returns.",
  goliath:
    "A Goliath is a bet on eight selections taking part in various events consisting of 28 doubles, 56 trebles, 70 fourfolds, 56 fivefolds, 28 sixfolds, eight sevenfolds and an eightfold accumulator totalling 247 bets. Two selections must win to ensure any returns.",
};
