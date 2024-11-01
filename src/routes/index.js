import express from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import postRoutes from "./post.routes.js";
import storageRoutes from "./storage.routes.js";

const router = express.Router();

router.use(userRoutes);
router.use(authRoutes);
router.use(postRoutes);
router.use(storageRoutes);

export default router;
