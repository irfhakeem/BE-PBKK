import express from "express";
import authenticate from "../middleware/middleware.js";
import tagController from "../controller/tag.controller.js";

const router = express.Router();

router.get("/tag/recommended", authenticate, tagController._GetRecommendedTags);
router.post("/tag", authenticate, tagController._GetTagById);
router.post("/tag/create", authenticate, tagController._CreateTag);

export default router;
