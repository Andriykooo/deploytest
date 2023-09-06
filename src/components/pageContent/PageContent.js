import { HtmlParse } from "../htmlParse/HtmlParse";

export const PageContent = ({ content }) => {
  return (
    <div className="page-content">
      <HtmlParse html={content} />
    </div>
  );
};
