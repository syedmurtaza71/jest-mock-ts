"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _User = _interopRequireDefault(require("../controller/User"));
var _User2 = _interopRequireDefault(require("../middleware/User"));
const router = _express.default.Router();
const {
  createUser,
  getUser
} = _User.default;
const {
  authenticate
} = _User2.default;
router.post("/create", authenticate, createUser);
router.get("/get/:id", authenticate, getUser);
var _default = router;
exports.default = _default;