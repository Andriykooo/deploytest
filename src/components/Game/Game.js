import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { addToFavouriteGames, removeFromFavouriteGames } from "@/store/actions";
import { useClientTranslation } from "@/app/i18n/client";

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
          const image = trendingNumbers[element];

          return (
            <Image
              key={index}
              src={image}
              height={133}
              width={"auto"}
              alt="number"
            />
          );
        })}
    </div>
  );
};

export const Game = ({ game, className, number, height, width }) => {
  const { t } = useClientTranslation(["casino", "common"]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loggedUser);
  const favoriteGames = useSelector((state) => state.favouriteGames);
  const [isOpen, setIsOpen] = useState(false);

  const isFavourite = favoriteGames?.[game.id] || game.favorite;

  const handleFavoriteGame = (game) => {
    if (!isFavourite) {
      dispatch(addToFavouriteGames(game));

      apiServices
        .post(apiUrl.ADD_TO_FAVORITE_GAMES, {
          gameId: game.id,
        })
        .then(() => {
          SuccesToast({ message: t("game_added_to_favorites") });
        });
    } else {
      dispatch(removeFromFavouriteGames(game));

      apiServices
        .delete(apiUrl.REMOVE_FROM_FAVORITE_GAMES, {
          gameId: game.id,
        })
        .then(() => {
          SuccesToast({ message: t("game_removed_from_favorites") });
        });
    }
  };

  const openGame = () => {
    setIsOpen(true);
  };

  const closeGame = () => {
    setIsOpen(false);
  };

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
            quality={50}
            priority
            onClick={openGame}
            width={width || 206}
            height={height || 190}
          />
          <button className="btnPrimary btnPlayNow" onClick={openGame}>
            {t("common:play_now")}
          </button>
        </div>
      </div>
      {isOpen && <CasinoPlayNow game={game} setGame={closeGame} />}
    </>
  );
};
