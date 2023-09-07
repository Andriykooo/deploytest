import { BetSelectedTypes } from "@/components/custom/BetSelectedTypes";
import { Footer } from "@/components/footer/Footer";
import { SidebarLayout } from "@/layouts/sidebarLayout/SidebarLayout";

export default function Layout({ children }) {
  return (
    <SidebarLayout sidebarLeftIsActive sidebarRightIsActive>
      {children}
      <div>
        <BetSelectedTypes />
        <Footer />
      </div>
    </SidebarLayout>
  );
}
