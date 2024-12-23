import express from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import postRoutes from "./post.routes.js";
import storageRoutes from "./storage.routes.js";
import listRoutes from "./list.routes.js";
import tagRoutes from "./tag.routes.js";

const router = express.Router();

router.use(userRoutes);
router.use(authRoutes);
router.use(postRoutes);
router.use(storageRoutes);
router.use(listRoutes);
router.use(tagRoutes);

export default router;
