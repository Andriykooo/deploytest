import { gamingSocket } from "@/context/socket";
import { EmptyFolder } from "@/utils/icons";
import { useEffect, useState } from "react";
import { MyBet } from "./MyBet/MyBet";
import { alertToast } from "@/utils/alert";
import { useTranslations } from "next-intl";
const myBetsArray = ["All", "Open", "Settled"];

export const MyBets = () => {
  const t = useTranslations("common");
  const [selectedButton, setSelectedButton] = useState(1);
  const [myBets, setMyBets] = useState(null);

  const getMyBets = (type) => {
    gamingSocket.emit("my_bets", { value: type }, (response) => {
      if (response?.data?.errorMessage) {
        alertToast({ message: response?.data?.errorMessage });
      } else {
        setMyBets(response.data);
      }
    });
  };

  useEffect(() => {
    getMyBets("all");
  }, []);

  const handleButtonClick = (buttonNumber) => {
    setSelectedButton(buttonNumber);

    if (buttonNumber === 1) {
      getMyBets("all");
    }

    if (buttonNumber === 2) {
      getMyBets("open");
    }

    if (buttonNumber === 3) {
      getMyBets("settled");
    }
  };

  return (
    <div>
      <div className="my-bets-container">
        {myBetsArray?.map((buttonValue, index) => {
          const buttonNumber = index + 1;
          return (
            <button
              key={buttonNumber}
              onClick={() => handleButtonClick(buttonNumber)}
              className={
                selectedButton === buttonNumber
                  ? "buttons-of-bets selected-myBets"
                  : "buttons-of-bets"
              }
            >
              {buttonValue}
            </button>
          );
        })}
      </div>
      {selectedButton === 1 && myBets?.length > 0 && (
        <div className="my-bets-hint">{t("showing_last_7_days")}</div>
      )}
      {myBets?.length > 0 ? (
        <div className="my-bets">
          {myBets.map((bet) => {
            return <MyBet key={bet.bet_id} data={bet} setData={setMyBets} />;
          })}
        </div>
      ) : (
        <div className="empty-slip">
          <span className="empty-slip-text mb">{t("empty_bet_slip")}</span>
          <EmptyFolder />
          <span className="empty-slip-text mt">
            {t("selections_description")}
          </span>
        </div>
      )}
    </div>
  );
};
