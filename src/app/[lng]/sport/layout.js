import { BetSelectedTypes } from "@/components/BetSelectedTypes/BetSelectedTypes";
import { Footer } from "@/components/footer/Footer";
import { SidebarLayout } from "@/layouts/sidebarLayout/SidebarLayout";

export default async function Layout({ children }) {
  return (
    <SidebarLayout sidebarLeftIsActive sidebarRightIsActive>
      <div className="sport-content">
        {children}
      </div>
      <div>
        <BetSelectedTypes />
        <Footer />
      </div>
    </SidebarLayout>
  );
}
