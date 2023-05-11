import { SocketContext } from "../../context/socket";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBet,
  removeBetAmount,
  removeReturnValue,
  setSidebarRight,
} from "../../store/actions";
import {
  CloseIcon,
  DownIcon,
  EmptyFolder,
  UpperIcon,
  XIcon,
} from "../../utils/icons";
import { BetSlipAds } from "../betSlip/BetSlipAds";
import { Button } from "../button/Button";
import { SelectOfMultipleBets } from "./SelectBetOfMultipleBets";
import { SelectedBet } from "./SelectedBet";

export const SidebarRight = () => {
  const dispatch = useDispatch();
  const isMobile = useSelector((state) => state.setMobile);
  const loggedUser = useSelector((state) => state.loggedUser);
  const betAmounts = useSelector((state) => state.betAmounts);
  const selectedBets = useSelector((state) => state.selectedBets);
  const sidebarRight = useSelector((state) => state.sidebarRight);
  const returnAmounts = useSelector((state) => state.returnAmounts);
  const [myBets, setMyBets] = useState(false);
  const [selectedButton, setSelectedButton] = useState(1);
  const [showExtraOdds, setShowExtraOdds] = useState(true);

  const { gamingSocket } = useContext(SocketContext);

  const sum = betAmounts.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);

  const returnSum = returnAmounts.reduce((accumulator, object) => {
    return accumulator + object.amount;
  }, 0);

  const otherWaysOfBets = [
    { nameOfBet: "Treble", odd: "(x1)", oddsAmount: "18/4" },
    { nameOfBet: "Double", odd: "(x2)", oddsAmount: "18/4" },
    { nameOfBet: "Single", odd: "(x3)", oddsAmount: "18/4" },
  ];

  const otherWaysOfBetsAdded = [
    { nameOfBet: "Trixie", odd: "(x4)", oddsAmount: "18/4" },
    { nameOfBet: "Patent", odd: "(x7)", oddsAmount: "18/4" },
  ];

  const myBetsArray = ["All", "Open", "Cash Out", "Settled"];

  const handleClick = () => {
    if (showExtraOdds === true) {
      setShowExtraOdds(false);
    } else setShowExtraOdds(true);
  };

  const handleClickBets = (type) => {
    if (type === "betslip") {
      setMyBets(false);
    } else setMyBets(true);
  };

  const handleButtonClick = (buttonNumber) => {
    setSelectedButton(buttonNumber);
  };

  useEffect(() => {
    gamingSocket?.emit("sidebar_right", {}, (response) => {
      dispatch(
        setSidebarRight({
          ...sidebarRight,
          data: response,
        })
      );
    });
  }, []);

  useEffect(() => {
    dispatch(removeBetAmount("all"));
    dispatch(removeReturnValue("all"));
  }, []);

  return (
    <div className="bet-slip-container">
      <div className="slip-bets-title slips-bets-title-container">
        {selectedBets?.length > 0 ? (
          <span className="numberOfBetsStyle">{selectedBets?.length}</span>
        ) : (
          ""
        )}
        <span
          className={
            selectedBets?.length < 1 && isMobile
              ? "betsStyle betStyleEmpty"
              : "betsStyle "
          }
        >
          Bets
        </span>
        {isMobile && (
          <span
            className="betsClose"
            onClick={() => {
              if (document.querySelector(".bet-slip-container")) {
                let actualDisplay = document.querySelector(
                  ".bet-slip-container"
                ).style.display;
                if (actualDisplay === "block") {
                  document.querySelector(".bet-slip-container").style.display =
                    "none";
                } else {
                  document.querySelector(".bet-slip-container").style.display =
                    "block";
                }
              }
            }}
          >
            <CloseIcon />
          </span>
        )}
      </div>
      <div className="slip-bets-title">
        <button
          className="bet-slip-description"
          style={
            myBets
              ? { background: "#1B1C21" }
              : {
                  background: "#404246",
                  color: "#fff",
                }
          }
          onClick={() => handleClickBets("betslip")}
        >
          <span
            className={
              selectedBets?.length < 1 && isMobile
                ? "betsStyle betStyleEmpty"
                : "betsStyle "
            }
          >
            BETSLIP
          </span>
        </button>
        <button
          className="bet-slip-description"
          style={
            myBets
              ? { background: "#404246", color: "#fff" }
              : { background: "#1B1C21" }
          }
          onClick={() => handleClickBets("mybets")}
        >
          MY BETS
        </button>
      </div>
      {!myBets ? (
        selectedBets && selectedBets.length > 0 ? (
          <>
            <div
              className="remove-all-bets"
              onClick={() => {
                dispatch(removeBet("all"));
                dispatch(removeBetAmount("all"));
              }}
            >
              <XIcon marginTop={2} />
              <span className="remove-text">Remove all bets</span>
            </div>
            <div className="selected-bets">
              {selectedBets.map((row, index) => {
                return <SelectedBet bet={row} key={index} />;
              })}
              {otherWaysOfBets.map((row, index) => {
                return <SelectOfMultipleBets bet={row} key={index} />;
              })}
              <div className="showOrHideMultiples" onClick={handleClick}>
                {showExtraOdds ? (
                  <>
                    <span className="showOrHideTextOfMultiples">
                      Show Less Multiples
                    </span>
                    <UpperIcon />
                  </>
                ) : (
                  <>
                    <span className="showOrHideTextOfMultiples">
                      Show All Multiples
                    </span>
                    <DownIcon />
                  </>
                )}
              </div>
              {showExtraOdds &&
                otherWaysOfBetsAdded.map((row, index) => {
                  return <SelectOfMultipleBets bet={row} key={index} />;
                })}
            </div>
            <div className="totals-container">
              <span>Total stakes: </span>
              <span>{sum.toFixed(2)}</span>
            </div>
            <div className="totals-container">
              <span>Total returns:</span>
              <span>{returnSum.toFixed(2)} </span>
            </div>
            {!loggedUser?.user_data ? (
              <div className="place-bet-container">
                <Link href="/login">
                  <Button
                    className={"btnPrimary place-bet-button"}
                    text={"LOG IN TO PLACE BET"}
                  />
                </Link>
              </div>
            ) : (
              <div className="place-bet-container">
                <Button
                  className={"btnPrimary place-bet-button"}
                  text={"PLACE BET 50.00 USD"}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="empty-slip">
              <span className="empty-slip-text mb">
                Your bet slip is empty!
              </span>{" "}
              <EmptyFolder />
              <span className="empty-slip-text mt">
                Make some selections and they will show up here
              </span>
            </div>{" "}
            {!isMobile && <BetSlipAds sidebarRightData={sidebarRight?.data} />}
          </>
        )
      ) : (
        <>
          <div className="my-bets-container">
            {myBetsArray.map((buttonValue, index) => {
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
          <div className="empty-slip">
            <span className="empty-slip-text mb">Your bet slip is empty!</span>{" "}
            <EmptyFolder />
            <span className="empty-slip-text mt">
              Make some selections and they will show up here
            </span>
          </div>{" "}
        </>
      )}
    </div>
  );
};
