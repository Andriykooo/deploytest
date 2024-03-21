import { BetSelectedTypes } from "@/components/BetSelectedTypes/BetSelectedTypes";

export default async function Layout({ children }) {
  return (
    <>
      <div className="sport-content">{children}</div>
      <div>
        <BetSelectedTypes />
      </div>
    </>
  );
}
