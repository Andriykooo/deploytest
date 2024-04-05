"use client";

import Image from "next/image";
import { CasinoPlayNow } from "../../components/modal/CasinoPlayNow";
import { useTranslations } from "next-intl";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import "./Casino.css";
import { useEffect, useState } from "react";
import { apiServices } from "@/utils/apiServices";
import { apiUrl } from "@/utils/constants";
import { notFound, useParams } from "next/navigation";

export const CasinoPage = () => {
  const t = useTranslations("casino");
  const params = useParams();
  const router = useCustomRouter();

  const [game, setGame] = useState(null);

  const close = () => {
    router.back();
  };

  useEffect(() => {
    apiServices
      .get(`${apiUrl.GET_GAME}?id=${params.gameId}`)
      .then((response) => {
        setGame(response);
      })
      .catch(() => {
        notFound();
      });
  }, []);

  return (
    game && (
      <>
        <div className="casino-background">
          <Image src={game?.web_image_url} alt={t("game")} fill />
        </div>

        <CasinoPlayNow game={game} onClose={close} />
      </>
    )
  );
};
