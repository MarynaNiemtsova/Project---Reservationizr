const mongoose = require("mongoose");
const _ = require("lodash");
const { seedData } = require("./seedData");
const ReservationModel = require("../src/models/ReservationModel");
const RestaurantModel = require("../src/models/RestaurantModel");

const { MongoMemoryServer } = require("mongodb-memory-server");

let instance;

beforeEach(async () => {
  await seedData();
});

afterEach(async () => {
  if (!ReservationModel || !_.isEmpty(ReservationModel)) {
    await ReservationModel.collection.deleteMany({});
  }
  if (!RestaurantModel || !_.isEmpty(RestaurantModel)) {
    await RestaurantModel.collection.deleteMany({});
  }
});

beforeAll(async () => {
  instance = await MongoMemoryServer.create();
  await mongoose.connect(instance.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await instance.stop();
});
