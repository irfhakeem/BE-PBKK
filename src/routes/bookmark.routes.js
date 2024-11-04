import express from "express";
import authenticate from "../middleware/middleware.js";
import bookmarkController from "../controller/bookmark.controller.js";

const router = express.Router();

router.get("/bookmark/", authenticate, bookmarkController._getUserBookmarks);
router.post("/bookmark/add", authenticate, bookmarkController._addBookmark);
router.delete(
  "/bookmark/remove",
  authenticate,
  bookmarkController._deleteBookmark
);
router.post(
  "/bookmark/is-bookmarked",
  authenticate,
  bookmarkController._isBookmarked
);

export default router;
