import { HtmlParse } from "../htmlParse/HtmlParse";
import "./PageContent.css";

export const PageContent = ({ content }) => {
  return (
    <div className="page-content">
      <HtmlParse scrollable html={content} />
    </div>
  );
};
