"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
const UserModel = new _mongoose.default.Schema({
  name: String,
  age: Number,
  gender: String
});
const User = _mongoose.default.model("User", UserModel);
var _default = User;
exports.default = _default;