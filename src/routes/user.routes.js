import express from "express";
import userController from "../controller/user.controller.js";
import authenticate from "../middleware/middleware.js";

const router = express.Router();

router.get("/user/me", authenticate, userController._Me);
router.patch("/user/update-profile", authenticate, userController._UpdateUser);
router.delete("/user/delete-profile", authenticate, userController._DeleteUser);
router.get("/user/:username", authenticate, userController._GetUserByUsername);

export default router;
