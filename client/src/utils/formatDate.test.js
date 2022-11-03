import { formatDate } from "./formatDate";
import timezoneMock from "timezone-mock";

it("should format a date string", () => {
  timezoneMock.register("UTC");
  const date = "2023-11-17T06:30:00.000Z";
  const received = formatDate(date);
  const expected = "6:30am Fri 17 Nov, 2023";
  expect(received).toEqual(expected);
});
