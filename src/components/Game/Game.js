import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SuccesToast, alertToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import { CasinoItemClose } from "@/icons/CasinoItemClose";
import { CasinoItemInfo } from "@/icons/CasinoItemInfo";
import { LikeIcon } from "@/icons/LikeIcon";
import { TrendingNumberIcon } from "@/icons/TrendingNumberIcon";
import { UnableIcon } from "@/icons/UnableIcon";
import { CasinoPlayNow } from "../modal/CasinoPlayNow";
import { addToFavouriteGames, removeFromFavouriteGames } from "@/store/actions";
import { useTranslations } from "@/hooks/useTranslations";
import { getLocalStorageItem } from "@/utils/localStorage";
import { Skeleton } from "../Skeleton/Skeleton";

const GAME_INFO_WIDTH = 268;
const GAME_INFO_HEIGHT = 248;

const GameImage = ({ game, playGame, setHasImage }) => {
  const isMobile = useSelector((state) => state.setMobile);
  const [imageLoad, setImageLoad] = useState(true);

  return (
    <>
      {imageLoad && <Skeleton height="100%" width="100%" />}
      <Image
        className="casinoGame"
        src={isMobile ? game?.mobile_image_url : game?.web_image_url}
        alt={game?.title}
        fill
        onLoad={() => {
          setImageLoad(false);
        }}
        onError={() => {
          setHasImage(false);
        }}
        onClick={() => playGame(game)}
      />
    </>
  );
};

export const Game = ({
  game,
  className,
  number,
  modalInfoId,
  showModalInfo,
  heroGames,
}) => {
  const t = useTranslations();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.loggedUser);
  const favoriteGames = useSelector((state) => state.favouriteGames);
  const isMobile = useSelector((state) => state.setMobile);

  const [isOpen, setIsOpen] = useState(false);
  const [hasImage, setHasImage] = useState(true);

  const isFavourite = favoriteGames.has(String(game.id));

  const handleFavoriteGame = (game) => {
    if (!isFavourite) {
      dispatch(addToFavouriteGames(String(game.id)));

      apiServices
        .post(apiUrl.ADD_TO_FAVORITE_GAMES, {
          gameId: game.id.toString(),
          instance: "casino_game",
        })
        .then(() => {
          SuccesToast({ message: t("casino.game_added_to_favorites") });
        });
    } else {
      dispatch(removeFromFavouriteGames(String(game.id)));

      apiServices
        .delete(apiUrl.REMOVE_FROM_FAVORITE_GAMES, {
          gameId: game.id.toString(),
        })
        .then(() => {
          alertToast({ message: t("casino.game_removed_from_favorites") });
        });
    }
  };

  const playGame = () => {
    setIsOpen(true);
  };

  const closeGame = () => {
    setIsOpen(false);
  };

  const handleNestedClick = (event) => {
    const rect = event.target.getBoundingClientRect();

    const x = rect.x - GAME_INFO_WIDTH + rect.width;
    const y = rect.y + rect.height + 2;

    const maxY = window.innerHeight - GAME_INFO_HEIGHT - 16;

    showModalInfo({
      position: {
        x: x < 20 ? 20 : x,
        y: y > maxY ? maxY : y,
      },
      gameId: game.id,
      title: game.title,
      details: game.details,
      playGame: () => playGame(game),
    });
  };

  return (
    <>
      {number && (
        <div className="trending-number-container">
          <TrendingNumberIcon
            isMobile={isMobile}
            number={number.toString().split("")}
          />
        </div>
      )}
      <div
        className={classNames("casino-item", {
          "hero-multi-line": heroGames,
          trending: number,
        })}
      >
        {modalInfoId === game.id && !isMobile ? (
          <div
            className="casino-item-info casino-item-close"
            onClick={(e) => handleNestedClick(e)}
          >
            <CasinoItemClose />
          </div>
        ) : (
          <div
            className="casino-item-info"
            onClick={(e) => handleNestedClick(e)}
          >
            <CasinoItemInfo isMobile={isMobile} />
          </div>
        )}
        <div
          className={classNames("gameImageWrapper", className, {
            unableToPreview: !hasImage,
          })}
        >
          {user?.user_data && getLocalStorageItem("access_token") && (
            <LikeIcon
              className={classNames("likeGame", { active: isFavourite })}
              onClick={() => {
                handleFavoriteGame(game);
              }}
            />
          )}
          {hasImage ? (
            <GameImage
              game={game}
              playGame={playGame}
              setHasImage={setHasImage}
            />
          ) : (
            <div
              className="unableToPreviewContent"
              onClick={() => playGame(game)}
            >
              <UnableIcon />
              {!isMobile && <span>{t("common.unable_to_preview")}</span>}
            </div>
          )}
        </div>
      </div>
      {isOpen && <CasinoPlayNow game={game} onClose={closeGame} />}
    </>
  );
};
