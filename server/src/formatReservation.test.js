const formatReservation = require("./formatReservation");

const reservationFromMongoose = {
  _id: { $oid: "507f1f77bcf86cd799439011" },
  partySize: 4,
  date: { $date: "2023-11-17T06:30:00.000Z" },
  userId: "614abe145f317b89a2e36883",
  restaurantName: "Island Grill",
};

describe("formatReservation", () => {
  it("should change _id to id", () => {
    const expected = {
      id: { $oid: "507f1f77bcf86cd799439011" },
      partySize: 4,
      date: { $date: "2023-11-17T06:30:00.000Z" },
      userId: "614abe145f317b89a2e36883",
      restaurantName: "Island Grill",
    };
    const received = formatReservation(reservationFromMongoose);
    expect(received).toEqual(expected);
  });
});
