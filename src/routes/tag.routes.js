import express from "express";
import authenticate from "../middleware/middleware.js";
import tagController from "../controller/tag.controller.js";

const router = express.Router();

router.get("/tag/recommended", authenticate, tagController._GetRecommendedTags);
router.post("/tag", authenticate, tagController._GetTagById);
router.post("/tag/create", authenticate, tagController._CreateTag);
router.post("/tag/contents", authenticate, tagController._GetContentByTag);
router.get(
  "/tag/recommended/detail",
  authenticate,
  tagController._GetRecommendedDetail
);
router.get("/tag/all", authenticate, tagController._GetAllTags);

export default router;
