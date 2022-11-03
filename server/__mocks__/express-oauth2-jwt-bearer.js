const auth = jest.fn().mockImplementation((options) => (req, res, next) => {
  req.auth = {
    payload: {
      sub: "mock-user-id",
    },
  };
  next();
});

module.exports = { auth };
