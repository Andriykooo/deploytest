import { BetSelectedTypes } from "@/components/BetSelectedTypes/BetSelectedTypes";
import { RacecardNavigation } from "./navigation";

export default function Layout({ children }) {
  return (
    <>
      <RacecardNavigation>{children}</RacecardNavigation>
      <BetSelectedTypes />
    </>
  );
}
