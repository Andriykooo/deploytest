import "./HtmlParse.css";

export const HtmlParse = ({ html, title }) => {
  return (
    <div>
      {title && <p className="html-parse-title">{title}</p>}
      <div
        className="html-parse-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
