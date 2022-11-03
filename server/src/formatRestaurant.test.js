const formatRestaurant = require("./formatRestaurant");

describe("formatRestaurant", () => {
  it("should format a restaurant from Mongoose to API spec", () => {
    const validRestaurants = {
      name: "Mock description",
      description: "Mock description",
      image: "Mock description",
    };
    const received = formatRestaurant({
      _id: "abc",
      __v: "this-should-be-removed",
      ...validRestaurants,
    });
    const expected = {
      ...validRestaurants,
      id: "abc",
    };
    expect(received).toEqual(expected);
  });
});
