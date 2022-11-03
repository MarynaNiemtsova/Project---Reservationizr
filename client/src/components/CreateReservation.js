import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useAuth0 } from "@auth0/auth0-react";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateReservation.css";

const CreateReservation = ({ restaurantName }) => {
  const [partySize, setPartySize] = useState("");
  const [date, setDate] = useState(new Date());
  const { getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const accessToken = await getAccessTokenSilently();

    setIsLoading(true);

    const reservation = {
      partySize: Number(partySize),
      date,
      restaurantName,
    };
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/reservations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(reservation),
      }
    );
    if (!response.ok) {
      setIsError(true);
      setErrorStatus(response.status);
    } else {
      setIsLoading(false);
      navigate("/");
    }
  };

  if (isError) {
    return (
      <>
        <p>Error creating a reservation (error status {errorStatus})</p>
      </>
    );
  }

  return (
    <>
      <h2 className="newReserve">Reserve {restaurantName}</h2>
      <form onSubmit={handleSubmit}>
        <div className="partySize">
          <label htmlFor="partySize">
            Number of guests<br></br>
          </label>
          <input
            type="number"
            id="partySize"
            className="form-input"
            value={partySize}
            onChange={(event) => {
              setPartySize(event.target.value);
            }}
            required
          />
        </div>
        <div className="startDate">
          <label htmlFor="startDate">Date</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            showTimeSelect
            dateFormat="Pp"
          />
        </div>
        <button className="submit-btn" disabled={isLoading}>
          Submit
        </button>
      </form>
    </>
  );
};

export default CreateReservation;
