"use client";

import Image from "next/image";
import { CasinoPlayNow } from "../../components/modal/CasinoPlayNow";
import { useTranslations } from "next-intl";
import { useCustomRouter } from "@/hooks/useCustomRouter";
import "./Casino.css";

export const CasinoPage = ({ game }) => {
  const t = useTranslations("casino");
  const router = useCustomRouter();

  const close = () => {
    router.back();
  };

  return (
    <>
      <div className="casino-background">
        <Image src={game?.web_image_url} alt={t("game")} fill />
      </div>

      <CasinoPlayNow game={game} onClose={close} />
    </>
  );
};
