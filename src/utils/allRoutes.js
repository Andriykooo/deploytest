import BetHistory from "@/screens/BetHistory/BetHistory";
import MatchDetails from "../components/matches/MatchDetails";
import BonuesesAndPromotions from "../screens/BonuesesAndPromotions/BonuesesAndPromotions";
import Deposit from "../screens/Deposit/Deposit";
import DepositLimit from "../screens/DepositLimit/DepositLimit";
import Email from "../screens/ForgotPassword/Email";
import ForgotPassword from "../screens/ForgotPassword/ForgotPassword";
import Home from "../screens/Home/Home";
import InPlay from "../screens/InPlay/InPlay";
import Kyc from "../screens/Kyc/Kyc";
import { Verification } from "../screens/Kyc/Verification";
import NetDeposit from "../screens/NetDeposit/NetDeposit";
import Notifications from "../screens/Notifications/Notifications";
import OddsFormat from "../screens/OddsFormat/OddsFormat";
import OpenPredictions from "../screens/OpenPredictions/OpenPredictions";
import Privacy from "../screens/Privacy/Privacy";
import Profile from "../screens/Profile/Profile";
import { Racecard } from "../screens/Racecard/Racecard";
import RealityCheck from "../screens/RealityCheck/RealityCheck";
import SaferGambling from "../screens/SaferGambling/SaferGambling";
import SaferGamblingInformation from "../screens/SaferGamblingInformation/SaferGamblingInformation";
import SelfExclude from "../screens/SelfExclude/SelfExclude";
import SettledPredictions from "../screens/SettledPredictions/SettledPredictions";
import FinishAccountSetup from "../screens/SignUp/FinishAccountSetup";
import SignUp from "../screens/SignUp/SignUp";
import SignUpWithPhone from "../screens/SignUp/SignUpWithPhone";
import VerifyEmail from "../screens/SignUp/verifyEmail";
import Sports from "../screens/Sports/Sports";
import SuspendAccount from "../screens/SuspendAccount/SuspendAccount";
import Terms from "../screens/Terms/Terms";
import TransactionHistory from "../screens/TransactionHistory/TransactionHistory";
import Withdraw from "../screens/Withdraw/Withdraw";

export const authRoutes = [
  { path: "/home", component: <Home /> },
  { path: "/privacy", component: <Privacy /> },
  { path: "/terms", component: <Terms /> },
  { path: "/sign_up", component: <SignUp /> },
  { path: "/sign_up_with_phone", component: <SignUpWithPhone /> },
  { path: "/forgot_password", component: <ForgotPassword /> },
  { path: "/sport/:slug", component: <Sports /> },
  { path: "/in-play/:id", component: <InPlay /> },
  { path: "/match/:id", component: <MatchDetails /> },
  { path: "/email_sent", component: <Email /> },
  { path: "/verify_email", component: <VerifyEmail /> },
  { path: "/racecard/:id", component: <Racecard /> },
  { path: "/casino/:gameId", component: <CasinoPage /> },
  { path: "/", component: <Home /> },
];

export const userRoutes = [
  { path: "/bonuses_promotions", component: <BonuesesAndPromotions /> },
  { path: "/deposit_limit", component: <DepositLimit /> },
  {
    path: "/safer_gambling_information",
    component: <SaferGamblingInformation />,
  },
  { path: "/withdraw", component: <Withdraw /> },
  { path: "/net_deposit", component: <NetDeposit /> },
  { path: "/profile", component: <Profile /> },
  { path: "/notifications", component: <Notifications /> },
  { path: "/odds_format", component: <OddsFormat /> },
  { path: "/self_exclude", component: <SelfExclude /> },
  { path: "/safer_gambling", component: <SaferGambling /> },
  { path: "/open_predictions", component: <OpenPredictions /> },
  { path: "/bet_history", component: <BetHistory /> },
  { path: "/reality_check", component: <RealityCheck /> },
  { path: "/suspend_account", component: <SuspendAccount /> },
  { path: "/deposit", component: <Deposit /> },
  { path: "/settled_predictions", component: <SettledPredictions /> },
  { path: "/transaction_history", component: <TransactionHistory /> },
  { path: "/finish_account_setup", component: <FinishAccountSetup /> },
  { path: "/kyc", component: <Kyc /> },
  { path: "/verification", component: <Verification /> },
  { path: "/change_password", component: <ChangePasswordMobile /> },
];
