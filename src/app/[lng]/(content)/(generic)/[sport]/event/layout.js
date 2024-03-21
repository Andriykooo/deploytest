import { BetSelectedTypes } from "@/components/BetSelectedTypes/BetSelectedTypes";

export default function Layout({ children }) {
  return (
    <>
      <div className="sport-container">{children}</div>
      <BetSelectedTypes />
    </>
  );
}
