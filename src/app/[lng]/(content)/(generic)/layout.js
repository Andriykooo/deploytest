import { Footer } from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { SidebarLayout } from "@/layouts/sidebarLayout/SidebarLayout";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <SidebarLayout>
        <div className="d-flex flex-column flex-grow-1">{children}</div>
        <Footer />
      </SidebarLayout>
    </>
  );
}
