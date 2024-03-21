import "./DepositLimit.css";
import DepositLimitComponent from "@/components/DepositLimitComponent/DepositLimitComponent";

const DepositLimit = () => {
  return (
    <DepositLimitComponent
      backRoute="/settings/safer_gambling"
      showBackOnDesktop
      removeLimit
    />
  );
};

export default DepositLimit;
