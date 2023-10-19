import Spinner from "react-bootstrap/Spinner";

function Spiner({ sell }) {
  return (
    <div
      className={sell ? "spinnerPadding spinnerPosition" : "spinnerPosition"}
    >
      <Spinner
        animation="border"
        role="status"
        style={{ color: "white", marginTop: "30px", marginBottom: "35px" }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

export default Spiner;
