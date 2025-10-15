import express from "express";
import { getUserData } from "../controller/user.controller.js";
import authMiddleware from "../middleware/user.auth.js";
const userRouter = express.Router();
userRouter.get("/data" ,authMiddleware, getUserData);
export default userRouter;

