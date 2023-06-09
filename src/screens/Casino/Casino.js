"use client";

import { Footer } from "@/components/footer/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CasinoPlayNow } from "../../components/modal/CasinoPlayNow";

export const CasinoPage = ({ game }) => {
  const router = useRouter();

  const close = () => {
    router.back();
  };

  return (
    <>
      <div className="casino-background">
        <Image src={game?.image_url} alt="game" fill />
      </div>
      <CasinoPlayNow game={game} setGame={close} />
    </>
  );
};
