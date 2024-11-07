import express from "express";
import userController from "../controller/user.controller.js";
import authenticate from "../middleware/middleware.js";

const router = express.Router();

router.get("/user/me", authenticate, userController._Me);
router.patch("/user/update-profile", authenticate, userController._UpdateUser);
router.delete("/user/delete-profile", authenticate, userController._DeleteUser);
router.get("/user/random-users", authenticate, userController._GetRandomUsers);
router.get("/user/following", authenticate, userController._GetFollowing);
router.get("/user/:username", authenticate, userController._GetUserByUsername);
router.patch("/user/deactivate", authenticate, userController._DeactivateUser);
router.post("/user/follow", authenticate, userController._FollowUser);
router.delete("/user/unfollow", authenticate, userController._UnfollowUser);
router.post("/user/is-following", authenticate, userController._IsFollowing);
router.get("/search", authenticate, userController._Search);

export default router;
