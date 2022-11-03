const mongoose = require("mongoose");
const { seedData } = require("./seedData");

const seedDocker = async () => {
  console.log("Seeding data to MongoDB");
  await mongoose.connect("mongodb://localhost:27017/mongo");
  await seedData(mongoose);
  await mongoose.disconnect();
  console.log("Data seeded");
};

seedDocker();
