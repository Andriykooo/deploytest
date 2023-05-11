import { BaseLayout } from "../../components/baseLayout/BaseLayout";
import Footer from "../../components/footer/Footer";
import { PageLayout } from "../../components/pageLayout/PageLayout";
import { SidebarLayout } from "../../components/sidebarLayout/SidebarLayout";

export const Home = () => {
  return (
    <BaseLayout title="Home">
      <SidebarLayout left right>
        <PageLayout type="home_page">
          {/* todo: 378-add-bet-tips-component 
           <BetSelectedTypes />  */}
          {/* todo: 379-add-lets-play-component
           <p className="descriptionStyleOfPlay">
              <span className="descriptionStyleOfPlayFirst">
                <Fragment>
                  Let’s <span className="descriptionStyleOfPlay">play!</span>
                </Fragment>
              </span>{" "}
            </p>
            <div className="home-live-matches-footer">
              {liveGamesData.map((row, index) => (
                <div className="containerOfLiveGamesFooter" key={index}>
                  {row.icon}
                  <p className="titleOfLiveGames">{row.title}</p>
                  <p className="paragraphOfLiveGame">{row.text}</p>
                </div>
              ))}
            </div> */}
        </PageLayout>
        <Footer />
      </SidebarLayout>
    </BaseLayout>
  );
};
