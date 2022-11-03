const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { celebrate, Joi, errors, Segments } = require("celebrate");
const { auth } = require("express-oauth2-jwt-bearer");
const RestaurantModel = require("./models/RestaurantModel");
const ReservationModel = require("./models/ReservationModel");
const formatRestaurant = require("./formatRestaurant");
const formatReservation = require("./formatReservation");

const app = express();
const checkJwt = auth({
  audience: "https://Reservationizr.com",
  issuerBaseURL: `https://dev-kaesbkz8.us.auth0.com/`,
});

app.use(cors());
app.use(express.json());

app.get("/restaurants", async (req, res, next) => {
  try {
    const restaurants = await RestaurantModel.find({});
    return res.status(200).send(restaurants.map(formatRestaurant));
  } catch (error) {
    error.status = 400;
    next(error);
  }
});
app.get("/restaurants/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "invalid id provided" });
    }

    const property = await RestaurantModel.findById(id);

    if (property === null) {
      return res.status(404).send({ error: "restaurant not found" });
    }

    return res.status(200).send(formatRestaurant(property));
  } catch (error) {
    error.status = 400;
    next(error);
  }
});
app.post(
  "/reservations",
  checkJwt,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      partySize: Joi.number(),
      date: Joi.string().required(),
      restaurantName: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    try {
      const { body, auth } = req;
      const reservationBody = {
        userId: auth.payload.sub,
        ...body,
      };
      const reservation = new ReservationModel(reservationBody);
      await reservation.save();
      return res.status(201).send(formatReservation(reservation));
    } catch (error) {
      error.status = 400;
      next(error);
    }
  }
);
app.get("/reservations", checkJwt, async (req, res, next) => {
  try {
    const { auth } = req;
    const reservationBody = {
      userId: auth.payload.sub,
    };

    const reservations = await ReservationModel.find({
      userId: reservationBody.userId,
    });

    return res.status(200).send(reservations.map(formatReservation));
  } catch (error) {
    error.status = 400;
    next(error);
  }
});
app.get("/reservations/:id", checkJwt, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { auth } = req;

    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      return res.status(400).send({ error: "invalid id provided" });
    }

    const reservation = await ReservationModel.findById(id);
    if (reservation === null) {
      return res.status(404).send({ error: "not found" });
    }
    if (reservation.userId === auth.payload.sub) {
      return res.status(200).send(formatReservation(reservation));
    } else {
      return res.status(403).send({
        error: "user does not have permission to access this reservation",
      });
    }
  } catch (error) {
    error.status = 400;

    next(error);
  }
});
app.use(errors());
module.exports = app;
