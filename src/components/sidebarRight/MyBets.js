import { gamingSocket } from "@/context/socket";
import { EmptyFolder } from "@/utils/icons";
import { useEffect, useState } from "react";
import { MyBet } from "./MyBet/MyBet";
import { alertToast } from "@/utils/alert";

const myBetsArray = ["All", "Open", "Settled"];

export const MyBets = () => {
  const [selectedButton, setSelectedButton] = useState(1);
  const [myBets, setMyBets] = useState(null);

  useEffect(() => {
    gamingSocket.emit("my_bets", {}, (response) => {
      if (response?.data?.errorMessage) {
        alertToast({ message: response?.data?.errorMessage });
      } else {
        setMyBets(response.data);
      }
    });
  }, []);

  const handleButtonClick = (buttonNumber) => {
    setSelectedButton(buttonNumber);
  };

  const filteredBets = myBets?.filter((bet) => {
    if (selectedButton === 1) {
      return true;
    }

    if (selectedButton === 2) {
      return bet.result === "open";
    }

    if (selectedButton === 3) {
      return bet.result !== "open";
    }
  });

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
      {selectedButton === 1 && filteredBets?.length > 0 && (
        <div className="my-bets-hint">Showing last 7 days</div>
      )}
      {filteredBets?.length > 0 ? (
        <div className="my-bets">
          {filteredBets.map((bet) => {
            return <MyBet key={bet.bet_id} data={bet} setData={setMyBets} />;
          })}
        </div>
      ) : (
        <div className="empty-slip">
          <span className="empty-slip-text mb">Your bet slip is empty!</span>
          <EmptyFolder />
          <span className="empty-slip-text mt">
            Make some selections and they will show up here
          </span>
        </div>
      )}
    </div>
  );
};
