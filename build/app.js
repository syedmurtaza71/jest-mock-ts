"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _express = _interopRequireDefault(require("express"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _user = _interopRequireDefault(require("./routes/user"));
const app = (0, _express.default)();
_dotenv.default.config({
  path: ".env"
});
app.use(_express.default.json());
_mongoose.default.set('strictQuery', false);

//ROUTES
app.use("/user", _user.default);

//PORT SETUP
const PORT = process.env.PORT || 4451;
const URI = process.env.MONGO_URI;

//PORT LISTENING
app.listen(PORT, () => {
  console.log(`PORT CONNECTED`);
});
_mongoose.default.connect(URI).then(() => {
  console.log("MONGO-DB CONNECTED");
});