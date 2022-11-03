import "./ReserveNow.css";
import { Link } from "react-router-dom";

const ReserveNow = (id) => {
  return (
    <p>
      <Link className="btn-reserve" to={`/restaurants/${id}`}>
        Reserve Now &#x27F6;
      </Link>
    </p>
  );
};

export default ReserveNow;
