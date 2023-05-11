import { BaseLayout } from "../../components/baseLayout/BaseLayout";
import Footer from "../../components/footer/Footer";
import { PageLayout } from "../../components/pageLayout/PageLayout";

export const Page = ({ name, path }) => {
  return (
    <BaseLayout title={name}>
      <PageLayout type={path.substring(1)} />
      <Footer />
    </BaseLayout>
  );
};
