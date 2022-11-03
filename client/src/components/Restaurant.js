import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateReservation from "./CreateReservation";
import "./Restaurant.css";

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchUrl = await fetch(
        `${process.env.REACT_APP_API_URL}/restaurants/${id}`
      );

      const data = await fetchUrl.json();
      setRestaurant(data);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="main">
        <div className="singleRestaurant">
          <img src={restaurant.image} alt={restaurant} />

          <ul>
            <li>
              <h2>{restaurant.name}</h2>
            </li>
            <li>
              <p>{restaurant.description}</p>
            </li>
          </ul>
        </div>
        <CreateReservation restaurantName={restaurant.name} />
      </div>
    </>
  );
};

export default Restaurant;
