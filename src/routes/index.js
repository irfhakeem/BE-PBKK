import express from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";

const router = express.Router();

router.use(userRoutes);
router.use(authRoutes);

export default router;
