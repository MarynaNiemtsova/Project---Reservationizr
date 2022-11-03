const mongoose = require("mongoose");
const _ = require("lodash");
const reservations = require("../../data/reservations.json");
const restaurants = require("../../data/restaurants.json");
const ReservationModel = require("../src/models/ReservationModel");
const RestaurantModel = require("../src/models/RestaurantModel");

const seedData = async () => {
  // mongoose does not support the "$oid" syntax in the JSON
  // so replace it with a mongoose ObjectId
  const formattedReservations = reservations.map((reservation) => {
    return {
      ...reservation,
      _id: new mongoose.Types.ObjectId(reservation._id.$oid),
      date: reservation.date.$date,
    };
  });
  if (!ReservationModel || !_.isEmpty(ReservationModel)) {
    await ReservationModel.collection.insertMany(formattedReservations);
  }

  const formattedRestaurants = restaurants.map((restaurant) => {
    return {
      ...restaurant,
      _id: new mongoose.Types.ObjectId(restaurant._id.$oid),
      name: restaurant.name,
      description: restaurant.description,
      image: restaurant.image,
    };
  });
  if (!RestaurantModel || !_.isEmpty(RestaurantModel)) {
    await RestaurantModel.collection.insertMany(formattedRestaurants);
  }
};

module.exports = { seedData };
