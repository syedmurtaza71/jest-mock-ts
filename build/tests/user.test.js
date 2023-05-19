"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _supertest = _interopRequireDefault(require("supertest"));
var _express = _interopRequireDefault(require("express"));
var _user = _interopRequireDefault(require("../routes/user"));
var _mongoose = _interopRequireDefault(require("mongoose"));
// import middleware from "../middleware/User"; // these are imports that are only to check if the mocked were called
// import service1 from "@Service1"; //same 
const app = (0, _express.default)();
app.use("/user", _user.default);
let server;
beforeAll(() => {
  server = app.listen(3000);
  _mongoose.default.connect("mongodb+srv://murtazaali:murtazaali@cluster0.fim0bgl.mongodb.net/?retryWrites=true&w=majority", () => {
    console.log(`DB CONNECTED`);
  });
});
jest.mock("../middleware/User", () => {
  return {
    authenticate: jest.fn((req, res, next) => {
      console.log("Mocker Mocks");
      next();
    })
  };
});
jest.mock("../services/service-1", () => {
  return {
    service_1: jest.fn(() => {
      console.log("I am a 3rd Party Mocked Service");
    })
  };
});
describe("tests", () => {
  // Add a beforeAll hook to start the server
  test('should return 200', async () => {
    const response = await (0, _supertest.default)(server).get("/user/get/64637ec3689ce8cca4edd505");
    expect(response.status).toEqual(200);
  });
});

// Add an afterAll hook to close the server
afterAll(() => {
  server.close();
});