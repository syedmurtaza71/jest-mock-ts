import express from "express"
import controller from "../controller/User"
import middleware from "../middleware/User";

const router = express.Router();
const { createUser, getUser } = controller;
const { authenticate } = middleware

router.post("/create",authenticate,createUser);
router.get("/get/:id",authenticate,getUser);

export default router;