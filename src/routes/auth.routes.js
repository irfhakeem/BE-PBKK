import express from "express";
import userController from "../controller/user.controller.js";

const router = express.Router();

router.post("/auth/register", userController._RegisterUser);
router.post("/auth/login", userController._LoginUser);

export default router;
