const request = require("supertest");
const app = require("./app");

describe("app", () => {
  test("GET /restaurants returns 200 a list of restaurants", async () => {
    const expectedStatus = 200;
    const expectedBody = [
      {
        id: "616005cae3c8e880c13dc0b9",
        name: "Curry Place",
        description:
          "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
        image: "https://i.ibb.co/yftcRcF/indian.jpg",
      },
      {
        id: "616005e26d59890f8f1e619b",
        name: "Thai Isaan",
        description:
          "We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.",
        image: "https://i.ibb.co/HPjd2jR/thai.jpg",
      },
      {
        id: "616bd284bae351bc447ace5b",
        name: "Italian Feast",
        description:
          "From the Italian classics, to our one-of-a-kind delicious Italian favourites, all of our offerings are handcrafted from the finest, freshest ingredients available locally. Whether you're craving Italian comfort food like our Ravioli, Pappardelle or something with a little more Flavour like our famous Fettuccine Carbonara.",
        image: "https://i.ibb.co/0r7ywJg/italian.jpg",
      },
    ];

    await request(app)
      .get("/restaurants")
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedBody);
      });
  });
  test("GET /restaurants/:id returns 200 a single restaurant", async () => {
    const expectedStatus = 200;
    const expectedBody = {
      id: "616005cae3c8e880c13dc0b9",
      name: "Curry Place",
      description:
        "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
      image: "https://i.ibb.co/yftcRcF/indian.jpg",
    };

    await request(app)
      .get("/restaurants/616005cae3c8e880c13dc0b9")
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedBody);
      });
  });
  test("GET /restaurants/:id returns 400 when an invalid id", async () => {
    const expectedStatus = 400;

    await request(app)
      .get("/restaurants/bad-id")
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual({
          error: "invalid id provided",
        });
      });
  });
  test("GET /restaurants/:id returns 404 when you supply an id that doesn’t exist in the database", async () => {
    const expectedStatus = 404;

    await request(app)
      .get("/restaurants/616005cae3c8e880c13dc0b8")
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual({
          error: "restaurant not found",
        });
      });
  });
  test("POST /reservations returns 201 creates a new reservation", async () => {
    const expectedStatus = 201;
    const body = {
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "Island Grill",
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining(body));
        expect(response.body.id).toBeTruthy();
      });
  });
  test("POST /reservations returns a 400 when client has provided an invalid request body", async () => {
    const expectedStatus = 400;
    const body = {};

    await request(app).post("/reservations").send(body).expect(expectedStatus);
  });
  test("GET /reservations returns 200 all reservations", async () => {
    const expectedStatus = 200;
    const expectedBody = [
      {
        id: "507f1f77bcf86cd799439011",
        partySize: 4,
        date: "2023-11-17T06:30:00.000Z",
        userId: "mock-user-id",
        restaurantName: "Island Grill",
      },
      {
        id: "614abf0a93e8e80ace792ac6",
        partySize: 2,
        date: "2023-12-03T07:00:00.000Z",
        userId: "mock-user-id",
        restaurantName: "Green Curry",
      },
    ];

    await request(app)
      .get("/reservations")
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedBody);
      });
  });
  test("GET /reservations/:id returns 200 a single reservation", async () => {
    const expectedStatus = 200;
    const expectedBody = {
      id: "507f1f77bcf86cd799439011",
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      userId: "mock-user-id",
      restaurantName: "Island Grill",
    };

    await request(app)
      .get("/reservations/507f1f77bcf86cd799439011")
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedBody);
      });
  });
  test("GET /reservations/:id returns 400 when an invalid id", async () => {
    const expectedStatus = 400;
    const expectedBody = {
      error: "invalid id provided",
    };
    await request(app)
      .get("/reservations/bad-id")
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedBody);
      });
  });
  test("GET /reservations/:id returns 403 when the user is trying to access a reservation they did not create", async () => {
    const expectedStatus = 403;
    const expectedBody = {
      error: "user does not have permission to access this reservation",
    };
    await request(app)
      .get("/reservations/61679189b54f48aa6599a7fd")
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedBody);
      });
  });
  test("GET /reservations/:id returns 404 when you supply an id that doesn’t exist in the database", async () => {
    const expectedStatus = 404;
    const expectedBody = {
      error: "not found",
    };
    await request(app)
      .get("/reservations/507f1f77bcf86cd799439012")
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedBody);
      });
  });
});
