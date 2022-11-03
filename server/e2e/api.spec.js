require("dotenv").config();
const path = require("path");
const axios = require("axios").default;
const jestOpenAPI = require("jest-openapi").default;

jestOpenAPI(path.resolve("e2e/api-spec.yml"));

const decodeJwt = (token) => {
  if (token !== null || token !== undefined) {
    const base64String = token.split(".")[1];
    const decodedValue = JSON.parse(
      Buffer.from(base64String, "base64").toString("ascii")
    );

    return decodedValue;
  }
  return null;
};

let token;

if (!process.env.AUTH0_DOMAIN) {
  throw new Error("Missing AUTH0_DOMAIN GitHub secret");
}
if (!process.env.AUTH0_CLIENT_ID) {
  throw new Error("Missing AUTH0_CLIENT_ID GitHub secret");
}
if (!process.env.AUTH0_CLIENT_SECRET) {
  throw new Error("Missing AUTH0_CLIENT_SECRET GitHub secret");
}
if (!process.env.AUTH0_AUDIENCE) {
  throw new Error("Missing AUTH0_AUDIENCE GitHub secret");
}

beforeAll(async () => {
  const response = await axios.post(
    `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_AUDIENCE,
      grant_type: "client_credentials",
    }
  );
  token = response.data.access_token;
});
describe("API Specification", () => {
  describe("Get all restaurants", () => {
    test("200 response should meet spec", async () => {
      const res = await axios.get("http://localhost:5001/restaurants");

      expect(res.status).toEqual(200);
      expect(res).toSatisfyApiSpec();
    });
  });

  describe("Get all reservations", () => {
    test("200 response should meet spec", async () => {
      const res = await axios.get("http://localhost:5001/reservations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(res.status).toEqual(200);
      expect(res).toSatisfyApiSpec();
    });

    test("200 response should only contain reservations from logged in user", async () => {
      const { sub } = decodeJwt(token);
      const res = await axios.get("http://localhost:5001/reservations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(res.status).toEqual(200);
      const subMatchesUserId = (reservation) => reservation.userId === sub;
      expect(res.data.every(subMatchesUserId)).toBe(true);
    });

    test("401 response should meet spec", async () => {
      const res = await axios.get("http://localhost:5001/reservations", {
        validateStatus: (status) => {
          return status <= 401;
        },
      });

      expect(res.status).toEqual(401);
      expect(res).toSatisfyApiSpec();
    });
  });

  describe("Create a reservation", () => {
    test("201 response should meet spec", async () => {
      const body = {
        partySize: 4,
        date: new Date("2100-01-01").toISOString(),
        restaurantName: "Island Grill",
      };

      const res = await axios.post("http://localhost:5001/reservations", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(res.status).toEqual(201);
      expect(res).toSatisfyApiSpec();
    });

    test("400 response should meet spec", async () => {
      const body = {
        partySize: 4,
        restaurantName: "Island Grill",
      };

      const res = await axios.post("http://localhost:5001/reservations", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: (status) => {
          return status <= 400;
        },
      });

      expect(res.status).toEqual(400);
      expect(res).toSatisfyApiSpec();
    });

    test("401 response should meet spec", async () => {
      const body = {
        partySize: 4,
        date: new Date("2100-01-01").toISOString(),
        restaurantName: "Island Grill",
      };

      const res = await axios.post("http://localhost:5001/reservations", body, {
        validateStatus: (status) => {
          return status <= 401;
        },
      });

      expect(res.status).toEqual(401);
      expect(res).toSatisfyApiSpec();
    });
  });

  describe("Get a single reservation", () => {
    let id;

    // create a new reservation with this user
    // so it can be retrieved for testing
    beforeAll(async () => {
      const body = {
        partySize: 4,
        date: new Date("2100-01-01").toISOString(),
        restaurantName: "Island Grill",
      };

      const res = await axios.post("http://localhost:5001/reservations", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      id = res.data.id;
    });

    test("200 response should meet spec", async () => {
      const res = await axios.get(`http://localhost:5001/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(res.status).toEqual(200);
      expect(res).toSatisfyApiSpec();
    });

    test("400 response should meet spec", async () => {
      const res = await axios.get(
        "http://localhost:5001/reservations/invalid-id",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          validateStatus: (status) => {
            return status <= 400;
          },
        }
      );

      expect(res.status).toEqual(400);
      expect(res).toSatisfyApiSpec();
    });

    test("401 response should meet spec", async () => {
      const res = await axios.get(`http://localhost:5001/reservations/${id}`, {
        validateStatus: (status) => {
          return status <= 401;
        },
      });

      expect(res.status).toEqual(401);
      expect(res).toSatisfyApiSpec();
    });

    test("403 response should meet spec", async () => {
      const res = await axios.get(
        "http://localhost:5001/reservations/507f1f77bcf86cd799439011",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          validateStatus: (status) => {
            return status <= 403;
          },
        }
      );

      expect(res.status).toEqual(403);
      expect(res).toSatisfyApiSpec();
    });

    test("404 response should meet spec", async () => {
      const res = await axios.get(
        "http://localhost:5001/reservations/000000000000000000000000",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          validateStatus: (status) => {
            return status <= 404;
          },
        }
      );

      expect(res.status).toEqual(404);
      expect(res).toSatisfyApiSpec();
    });
  });

  describe("Get a single restaurant", () => {
    test("200 response should meet spec", async () => {
      const res = await axios.get(
        "http://localhost:5001/restaurants/616005cae3c8e880c13dc0b9"
      );

      expect(res.status).toEqual(200);
      expect(res).toSatisfyApiSpec();
    });

    test("400 response should meet spec", async () => {
      const res = await axios.get(
        "http://localhost:5001/restaurants/invalid-id",
        {
          validateStatus: (status) => {
            return status <= 400;
          },
        }
      );

      expect(res.status).toEqual(400);
      expect(res).toSatisfyApiSpec();
    });

    test("404 response should meet spec", async () => {
      const res = await axios.get(
        "http://localhost:5001/restaurants/000000000000000000000000",
        {
          validateStatus: (status) => {
            return status <= 404;
          },
        }
      );

      expect(res.status).toEqual(404);
      expect(res).toSatisfyApiSpec();
    });
  });
});
