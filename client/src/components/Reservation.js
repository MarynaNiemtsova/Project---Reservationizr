import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { formatDate } from "../utils/formatDate";
import "./Reservation.css";
import BackButton from "./BackButton";

const Reservation = () => {
  const { id } = useParams({});
  const { getAccessTokenSilently } = useAuth0();
  const [reservation, setReservation] = useState({});
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reservations/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok === false) {
        setIsNotFound(true);
        return;
      }

      const data = await response.json();
      setReservation(data);
      setIsLoading(false);
    };

    fetchData();
  }, [getAccessTokenSilently, id]);

  if (isNotFound) {
    return (
      <>
        <p className="error">Sorry! We can't find that reservation</p>
        <BackButton />
      </>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="reservation">
        <h2>{reservation.restaurantName}</h2>
        <p>{formatDate(reservation.date)}</p>
        <p className="partySize">
          Party size: <span className="number">{reservation.partySize}</span>
        </p>
      </div>
      <BackButton />
    </>
  );
};

export default Reservation;
