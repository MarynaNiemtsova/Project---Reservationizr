const mongoose = require("mongoose");
const { Schema } = mongoose;

const reservationSchema = new Schema({
  partySize: { type: Number, required: true, min: 1 },
  date: { type: Date, default: Date.now, min: Date.now },
  userId: { type: String, required: true },
  restaurantName: { type: String, required: true },
});
const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;
