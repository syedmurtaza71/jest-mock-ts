"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _User = _interopRequireDefault(require("../models/User"));
var _service = _interopRequireDefault(require("../services/service-1"));
var _default = {
  createUser: async (req, res) => {
    const user = new _User.default({
      name: "11",
      age: 33,
      gender: "FF"
    });
    const savedUser = await user.save();
    return res.status(200).json({
      message: "Saved User",
      user: savedUser
    });
  },
  getUser: async (req, res) => {
    const id = req.params.id;
    const foundUser = await _User.default.findOne({
      _id: id
    });
    await _service.default.service_1();
    return res.status(200).json({
      foundUser
    });
  }
};
exports.default = _default;