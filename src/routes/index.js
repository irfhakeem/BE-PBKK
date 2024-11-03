import express from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import postRoutes from "./post.routes.js";
import storageRoutes from "./storage.routes.js";
import bookmarkRoutes from "./bookmark.routes.js";

const router = express.Router();

router.use(userRoutes);
router.use(authRoutes);
router.use(postRoutes);
router.use(storageRoutes);
router.use(bookmarkRoutes);

export default router;
