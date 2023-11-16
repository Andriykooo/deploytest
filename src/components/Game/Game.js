import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { LikeIcon } from "../../utils/icons";
import { CasinoPlayNow } from "../modal/CasinoPlayNow";
import { addToFavouriteGames, removeFromFavouriteGames } from "@/store/actions";
import { useTranslations } from "next-intl";
import { images } from "@/utils/imagesConstant";
const trendingNumbers = {
  0: images.numberZeroTrending,
  1: images.numberOneTrending,
  2: images.numberTwoTrending,
  3: images.numberThreeTrending,
  4: images.numberFourTrending,
  5: images.numberFiveTrending,
  6: images.numberSixTrending,
  7: images.numberSevenTrending,
  8: images.numberEightTrending,
  9: images.numberNineTrending,
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
  const t = useTranslations();
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
          SuccesToast({ message: t("casino.game_added_to_favorites") });
        });
    } else {
      dispatch(removeFromFavouriteGames(game));

      apiServices
        .delete(apiUrl.REMOVE_FROM_FAVORITE_GAMES, {
          gameId: game.id,
        })
        .then(() => {
          SuccesToast({ message: t("casino.game_removed_from_favorites") });
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
            alt={game?.title}
            priority
            onClick={openGame}
            width={width || 206}
            height={height || 190}
          />
          <button className="btnPrimary btnPlayNow" onClick={openGame}>
            {t("common.play_now")}
          </button>
        </div>
      </div>
      {isOpen && <CasinoPlayNow game={game} setGame={closeGame} />}
    </>
  );
};
