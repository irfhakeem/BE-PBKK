import express from "express";
import authenticate from "../middleware/middleware.js";
import listController from "../controller/list.controller.js";

const router = express.Router();

router.get("/list", authenticate, listController._getMyLists);
router.post("/list/user-lists", authenticate, listController._getUserLists);
router.post("/list/create", authenticate, listController._createList);
router.delete("/list/delete", authenticate, listController._deleteList);
router.post("/list/add-post", authenticate, listController._addPostToList);
router.patch(
  "/list/remove-post",
  authenticate,
  listController._removePostFromList
);
router.post("/list/is-post-listed", authenticate, listController._isPostListed);
router.get("/list/:id", authenticate, listController._getSpecificList);
router.patch("/list/update", authenticate, listController._updateList);

export default router;
