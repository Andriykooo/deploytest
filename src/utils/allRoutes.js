import React from "react";
import MatchDetails from "../components/matches/MatchDetails";
import BonuesesAndPromotions from "../pages/BonuesesAndPromotions/BonuesesAndPromotions";
import Deposit from "../pages/Deposit/Deposit";
import DepositLimit from "../pages/DepositLimit/DepositLimit";
import Email from "../pages/ForgotPassword/Email";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Home from "../pages/Home/Home";
import InPlay from "../pages/InPlay/InPlay";
import Kyc from "../pages/Kyc/Kyc";
import { Verification } from "../pages/Kyc/Verification";
import NetDeposit from "../pages/NetDeposit/NetDeposit";
import Notifications from "../pages/Notifications/Notifications";
import OddsFormat from "../pages/OddsFormat/OddsFormat";
import OpenPredictions from "../pages/OpenPredictions/OpenPredictions";
import Privacy from "../pages/Privacy/Privacy";
import Profile from "../pages/Profile/Profile";
import RealityCheck from "../pages/RealityCheck/RealityCheck";
import SaferGambling from "../pages/SaferGambling/SaferGambling";
import SaferGamblingInformation from "../pages/SaferGamblingInformation/SaferGamblingInformation";
import SelfExclude from "../pages/SelfExclude/SelfExclude";
import SettledPredictions from "../pages/SettledPredictions/SettledPredictions";
import FinishAccountSetup from "../pages/SignUp/FinishAccountSetup";
import SignUp from "../pages/SignUp/SignUp";
import SignUpWithPhone from "../pages/SignUp/SignUpWithPhone";
import VerifyEmail from "../pages/SignUp/verifyEmail";
import Sports from "../pages/Sports/Sports";
import SuspendAccount from "../pages/SuspendAccount/SuspendAccount";
import Terms from "../pages/Terms/Terms";
import TransactionHistory from "../pages/TransactionHistory/TransactionHistory";
import Withdraw from "../pages/Withdraw/Withdraw";

export const authRoutes = [
  { path: "/home", component: <Home /> },
  { path: "/privacy", component: <Privacy /> },
  { path: "/terms", component: <Terms /> },
  { path: "/sign_up", component: <SignUp /> },
  { path: "/sign_up_with_phone", component: <SignUpWithPhone /> },
  { path: "/forgot_password", component: <ForgotPassword /> },
  { path: "/sports/:id", component: <Sports /> },
  { path: "/in-play/:id", component: <InPlay /> },
  { path: "/match/:id", component: <MatchDetails /> },
  { path: "/email_sent", component: <Email /> },
  { path: "/verify_email", component: <VerifyEmail /> },
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
  { path: "/reality_check", component: <RealityCheck /> },
  { path: "/suspend_account", component: <SuspendAccount /> },
  { path: "/deposit", component: <Deposit /> },
  { path: "/settled_predictions", component: <SettledPredictions /> },
  { path: "/transaction_history", component: <TransactionHistory /> },
  { path: "/finish_account_setup", component: <FinishAccountSetup /> },
  { path: "/kyc", component: <Kyc /> },
  { path: "/verification", component: <Verification /> },
];
