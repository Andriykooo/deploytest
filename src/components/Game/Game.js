import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import numberEightTrending from "../../assets/images/numberEightTrending.png";
import numberFiveTrending from "../../assets/images/numberFiveTrending.png";
import numberFourTrending from "../../assets/images/numberFourTrending.png";
import numberNineTrending from "../../assets/images/numberNineTrending.png";
import numberOneTrending from "../../assets/images/numberOneTrending.png";
import numberSevenTrending from "../../assets/images/numberSevenTrending.png";
import numberSixTrending from "../../assets/images/numberSixTrending.png";
import numberThreeTrending from "../../assets/images/numberThreeTRending.png";
import numberTwoTrending from "../../assets/images/numberTwoTrending.png";
import numberZeroTrending from "../../assets/images/numberZeroTrending.png";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { LikeIcon } from "../../utils/icons";
import { CasinoPlayNow } from "../modal/CasinoPlayNow";

const trendingNumbers = {
  0: numberZeroTrending,
  1: numberOneTrending,
  2: numberTwoTrending,
  3: numberThreeTrending,
  4: numberFourTrending,
  5: numberFiveTrending,
  6: numberSixTrending,
  7: numberSevenTrending,
  8: numberEightTrending,
  9: numberNineTrending,
};

const TrendingNumber = ({ number }) => {
  return (
    <div className="numbering">
      {number
        .toString()
        .split("")
        .map((element, index) => {
          return (
            <Image key={index} src={trendingNumbers[element]} alt="number" />
          );
        })}
    </div>
  );
};

export const Game = ({ game, className, number, onFavoriteToggle }) => {
  const user = useSelector((state) => state.loggedUser);

  const [isOpen, setIsOpen] = useState(false);
  const [isFavourite, setIsFavourite] = useState(game.favorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteGame = (game) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    if (!isFavourite) {
      setIsFavourite(true);

      apiServices
        .post(apiUrl.ADD_TO_FAVORITE_GAMES, {
          gameId: game.id,
        })
        .then(() => {
          onFavoriteToggle?.();
        })
        .catch(() => {
          setIsFavourite(false);
        })
        .finally(() => {
          SuccesToast({ message: "Game added to favorites!" });
          setIsLoading(false);
        });
    } else {
      setIsFavourite(false);

      apiServices
        .delete(apiUrl.REMOVE_FROM_FAVORITE_GAMES, {
          gameId: game.id,
        })
        .then(() => {
          onFavoriteToggle?.();
        })
        .catch(() => {
          setIsFavourite(true);
        })
        .finally(() => {
          SuccesToast({ message: "Game removed from favorites!" });
          setIsLoading(false);
        });
    }
  };

  const openGame = () => {
    setIsOpen(true);
  };

  const closeGame = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsFavourite(game.favorite);
  }, [game.favorite]);

  return (
    <>
      <div
        className={classNames("casino-item", className, { trending: number })}
      >
        {number && <TrendingNumber number={number} />}
        <div className="gameImageWrapper">
          {user?.user_data && (
            <LikeIcon
              className="likeGame"
              active={isFavourite}
              onClick={() => {
                handleFavoriteGame(game);
              }}
            />
          )}
          <Image
            className="casinoGame"
            src={game?.image_url}
            alt={game?.name}
            onClick={openGame}
            width={206}
            height={190}
          />
          <button className="btnPrimary btnPlayNow" onClick={openGame}>
            Play Now
          </button>
        </div>
      </div>
      {isOpen && <CasinoPlayNow game={game} setGame={closeGame} />}
    </>
  );
};
