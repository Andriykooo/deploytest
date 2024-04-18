import { gamingSocket } from "@/context/socket";
import { EmptyFolder } from "@/icons/EmptyFolder";
import { useState } from "react";
import { MyBet } from "./MyBet/MyBet";
import { alertToast } from "@/utils/alert";
import { useTranslations } from "@/hooks/useTranslations";
import { useDispatch, useSelector } from "react-redux";
import { setMyBets } from "@/store/actions";
import { getLocalStorageItem } from "@/utils/localStorage";
import { useAxiosData } from "@/hooks/useAxiosData";

const myBetsArray = ["all", "open", "settled"];

export const MyBets = () => {
  const dispatch = useDispatch();
  const t = useTranslations("common");

  const myBets = useSelector((state) => state.myBets);
  const [selectedButton, setSelectedButton] = useState("all");

  const isLoggedIn = getLocalStorageItem("access_token");

  const getMyBets = (type) => {
    gamingSocket.emit("my_bets", { value: type, page: 1 }, (response) => {
      if (response?.type === "error") {
        if (response?.data?.code === 1012) {
          alertToast({ message: t("please_login") });
        } else {
          alertToast({ message: response?.data?.errorMessage });
        }
      } else {
        dispatch(setMyBets({ ...myBets, [type]: response.data }));
      }
    });
  };

  useAxiosData(() => getMyBets(selectedButton), {}, [selectedButton]);

  const handleButtonClick = (type) => {
    setSelectedButton(type);
  };

  return (
    <div>
      <div className="my-bets-container">
        {myBetsArray?.map((buttonValue) => {
          return (
            <button
              key={buttonValue}
              onClick={() => handleButtonClick(buttonValue)}
              className={
                selectedButton === buttonValue
                  ? "buttons-of-bets selected-myBets"
                  : "buttons-of-bets"
              }
            >
              {t(buttonValue)}
            </button>
          );
        })}
      </div>
      {isLoggedIn && (
        <div className="my-bets-hint">{t("showing_last_7_days")}</div>
      )}

      {myBets?.[selectedButton]?.length > 0 && isLoggedIn ? (
        <>
          <div className="my-bets">
            {myBets[selectedButton].map((bet) => {
              return (
                <MyBet
                  key={bet.bet_id}
                  data={bet}
                  selectedButton={selectedButton}
                />
              );
            })}
          </div>
        </>
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
