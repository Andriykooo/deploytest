import { PwaInstall } from "@/components/pwa/PwaInstall";
import { BaseLayout } from "@/layouts/baseLayout/BaseLayout";

export default async function Layout({ children }) {

  return (
    <BaseLayout>
      {children}
      <PwaInstall />
    </BaseLayout>
  );
}
