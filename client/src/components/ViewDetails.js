import { Link } from "react-router-dom";
import "./ReservationList.css";

const ViewDetails = (id) => {
  return (
    <div>
      <Link className="link" to={`/reservations/${id}`}>
        View details &#x27F6;
      </Link>
    </div>
  );
};

export default ViewDetails;
