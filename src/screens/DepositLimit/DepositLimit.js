import "./DepositLimit.css";
import DepositLimitComponent from "@/components/DepositLimitComponent/DepositLimitComponent";

const DepositLimit = () => {
  return (
    <DepositLimitComponent
      backRoute="/profile/safer_gambling"
      showBackOnDesktop
    />
  );
};

export default DepositLimit;
