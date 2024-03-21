import classNames from "classnames";
import "./HtmlParse.css";

export const HtmlParse = ({ html, title, scrollable, className }) => {
  return (
    <div>
      {title && <p className="html-parse-title">{title}</p>}
      <div
        className={classNames(className ? className : "html-parse-content", {
          "scrollable-content": scrollable
        })}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
