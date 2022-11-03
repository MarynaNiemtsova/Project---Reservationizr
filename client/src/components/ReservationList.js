import "./ReservationList.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { formatDate } from "../utils/formatDate";
import ViewDetails from "./ViewDetails";
import { Link } from "react-router-dom";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const { userId } = useParams();
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reservations`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      setReservations(data);

      if (response.ok === true && Array.from(data).length === 0) {
        setIsNotFound(true);
        return;
      }
    };
    fetchData();
  }, [getAccessTokenSilently, userId]);
  if (isNotFound) {
    return (
      <>
        <h1>Upcoming reservations</h1>
        <p>You don't have any reservations</p>
        <div>
          <Link className="link" to="/">
            View the restaurants
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Upcoming reservations</h1>
      {reservations.map((reservation) => (
        <span className="reservationList" key={reservation.id}>
          <h2>{reservation.restaurantName}</h2>

          <p>{formatDate(reservation.date)}</p>

          <p> {ViewDetails(reservation.id)}</p>
        </span>
      ))}
    </>
  );
};

export default ReservationList;
