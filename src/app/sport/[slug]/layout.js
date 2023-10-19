import { BetSelectedTypes } from "@/components/custom/BetSelectedTypes";
import { Footer } from "@/components/footer/Footer";
import { SidebarLayout } from "@/layouts/sidebarLayout/SidebarLayout";

export default async function Layout({ children }) {
  return (
    <SidebarLayout sidebarLeftIsActive sidebarRightIsActive>
      <div>{children}</div>

      <div>
        <BetSelectedTypes />
        <Footer />
      </div>
    </SidebarLayout>
  );
}
