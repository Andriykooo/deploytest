import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SuccesToast } from "../../utils/alert";
import { apiServices } from "../../utils/apiServices";
import { apiUrl } from "../../utils/constants";
import {
  CasinoItemClose,
  CasinoItemInfo,
  LikeIcon,
  TrendingNumberIcon,
} from "../../utils/icons";
import { CasinoPlayNow } from "../modal/CasinoPlayNow";
import { addToFavouriteGames, removeFromFavouriteGames } from "@/store/actions";
import { useTranslations } from "next-intl";
import { GAME_INFO_HEIGHT, GAME_INFO_WIDTH } from "./GameInfoModal";
import { CasinoLogin } from "../modal/CasinoLogin";
import { usePathname, useRouter } from "next/navigation";
import { images } from "@/utils/imagesConstant";
import { useCustomRouter } from "@/hooks/useCustomRouter";

export const Game = ({
  game,
  className,
  number,
  modalInfoId,
  showModalInfo,
  heroGames
}) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.loggedUser);
  const favoriteGames = useSelector((state) => state.favouriteGames);
  const loggedUser = useSelector((state) => state.loggedUser);
  const isMobile = useSelector((state) => state.setMobile);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [gameUrl, setGameUrl] = useState("");
  const [hasImage, setHasImage] = useState(true);
  const router = useCustomRouter();
  const pathname = usePathname();
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

  const playGame = (game) => {
    if (!loggedUser) {
      router.push(`${pathname}?redirect=casino`);
      return setIsLoginOpen(true);
    }

    const payload = {
      game_id: game?.id,
      language: "en",
      platform: "WEB",
      minimode: isMobile ? "1" : "0",
      playMode: 'LIVE',
    };

    apiServices.post(apiUrl.OPEN_CASINO_GAME, payload).then((response) => {
      setGameUrl(response?.data?.gameURL);
      setIsOpen(true);
    });
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
        className={classNames(`casino-item ${heroGames? "hero-multi-line" : ""}`, { trending: number })}
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
        <div className={classNames("gameImageWrapper", className, {
          unableToPreview: !hasImage,
        })}>
          {user?.user_data && (
            <LikeIcon
              className="likeGame"
              active={isFavourite}
              onClick={() => {
                handleFavoriteGame(game);
              }}
            />
          )}
          {hasImage ? (
            <Image
              className="casinoGame"
              src={isMobile ? game?.mobile_image_url : game?.web_image_url}
              alt={game?.title}
              priority
              fill
              onError={() => {
                setHasImage(false);
              }}
              onClick={() => playGame(game)}
            />
          ) : (
            <div
              className="unableToPreviewContent"
              onClick={() => playGame(game)}
            >
              <Image
                src={images.unableImage}
                height={40}
                width={42}
                alt="error"
              />
              {!isMobile && <span>{t("common.unable_to_preview")}</span>}
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <CasinoPlayNow gameUrl={gameUrl} game={game} setGame={closeGame} />
      )}
      {isLoginOpen && (
        <CasinoLogin
          onClose={() => setIsLoginOpen(false)}
          bgImage={game?.web_image_url}
        />
      )}
    </>
  );
};
