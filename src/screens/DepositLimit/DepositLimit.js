import "./DepositLimit.css";
import DepositLimitComponent from "@/components/DepositLimitComponent/DepositLimitComponent";

const DepositLimit = () => {
  return (
    <DepositLimitComponent
      backRoute="/profile/safer_gambling"
      showBackOnDesktop
      removeLimit
    />
  );
};

export default DepositLimit;
