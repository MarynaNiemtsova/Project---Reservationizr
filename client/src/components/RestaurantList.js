import { useEffect, useState } from "react";
import ReserveNow from "./ReserveNow";
import "./RestaurantList.css";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/restaurants`
      );
      const data = await response.json();

      setRestaurants(data);
    };
    fetchData();
  }, []);
  return (
    <>
      <div className="mainRestaurants"></div>
      <h1>Restaurants</h1>
      {restaurants.map((restaurant) => (
        <div className="restaurant">
          <div className="list" key={restaurants.id}>
            <img src={restaurant.image} alt={restaurant} />

            <ul key={restaurants.id}>
              <li>
                <h2>{restaurant.name}</h2>
              </li>
              <li>
                <p>{restaurant.description}</p>
              </li>
              <li>{ReserveNow(restaurant.id)}</li>
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};

export default RestaurantList;
