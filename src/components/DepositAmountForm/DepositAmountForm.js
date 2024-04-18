import PreferencesTitle from "../preferencesTitle/PreferencesTitle";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "../button/Button";
import { Loader } from "../loaders/Loader";
import "../DepositAmountForm/DepositAmountForm.css";

const DepositAmountForm = ({ setAmount, amount, onSetAmount, isLoading }) => {
  const t = useTranslations();
  const abbreviation = useSelector(
    (state) => state.loggedUser?.user_data?.currency.abbreviation
  );

  const settings = useSelector((state) => state.settings);

  const amounts = settings?.deposit_amount_options;
  const handleSelectAmount = (event, value) => {
    event.preventDefault();
    setAmount(value);
  };

  return (
    <div className="max-width-container depositLimit">
      <PreferencesTitle
        title={t("common.deposit")}
        marginBottomSize="sm"
        // showBackOnDesktop={showBackOnDesktop}
      />
      <p className="select-amount-title">
        {t("deposit.amount_selection_prompt")} {abbreviation}
      </p>
      <form className="select-amount" onSubmit={(e) => e.preventDefault()}>
        <div>
          <div className="enter-amount-input">
            <input
              type="text"
              className="deposit-input"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              placeholder={amount ? amount : "0.00"}
            />
            <span className="deposit-input-text">{abbreviation}</span>
          </div>
          <div className="select-amount-buttons">
            {amounts.map((item) => (
              <button
                onClick={(e) => handleSelectAmount(e, item)}
                className={classNames("amount-button", {
                  "active-amount": item == amount,
                })}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <Button
          className={classNames("select-amount-submit", {
            "active-amount-submit": amount,
          })}
          onClick={onSetAmount}
          disabled={!amount}
          text={isLoading ? <Loader /> : t("common.authorise")}
        />
      </form>
    </div>
  );
};

export default DepositAmountForm;
