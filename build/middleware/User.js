"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  authenticate: async (req, res, next) => {
    console.log("Original");
    next();
  }
};
exports.default = _default;