import { Footer } from "@/components/footer/Footer";
import { SidebarLayout } from "@/layouts/sidebarLayout/SidebarLayout";
import { BetSelectedTypes } from "@/components/custom/BetSelectedTypes";
import { RacecardNavigation } from "./navigation";

export default function Layout({ children }) {
  return (
    <SidebarLayout sidebarLeftIsActive sidebarRightIsActive>
      <RacecardNavigation>{children}</RacecardNavigation>
      <div>
        <BetSelectedTypes />
        <Footer />
      </div>
    </SidebarLayout>
  );
}
