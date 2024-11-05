import express from "express";
import postController from "../controller/post.controller.js";
import authenticate from "../middleware/middleware.js";

const router = express.Router();

router.post("/post/create", authenticate, postController._CreatePost);
router.post("/post", authenticate, postController._GetPosts);
router.get("/post/:id", authenticate, postController._GetPostById);
router.delete("/post/delete/:id", authenticate, postController._DeletePost);
router.post("/post/like", authenticate, postController._LikePost);
router.delete("/post/unlike", authenticate, postController._UnlikePost);
router.post("/post/is-liked", authenticate, postController._IsPostLiked);

export default router;
