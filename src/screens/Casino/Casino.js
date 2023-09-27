"use client";

import { Footer } from "@/components/footer/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CasinoPlayNow } from "../../components/modal/CasinoPlayNow";
import { useClientTranslation } from "@/app/i18n/client";

export const CasinoPage = ({ game }) => {
  const { t } = useClientTranslation('casino');
  const router = useRouter();

  const close = () => {
    router.back();
  };

  return (
    <>
      <div className="casino-background">
        <Image src={game?.image_url} alt={t("game")} fill />
      </div>
      <CasinoPlayNow game={game} setGame={close} />
    </>
  );
};
