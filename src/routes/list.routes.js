import express from "express";
import authenticate from "../middleware/middleware.js";
import listController from "../controller/list.controller.js";

const router = express.Router();

router.get("/list", authenticate, listController._getMyLists);
router.get("/user-list", authenticate, listController._getUserLists);
router.get("/list/:id", authenticate, listController._getSpecificList);
router.post("/list/create", authenticate, listController._createList);
router.delete("/list/delete", authenticate, listController._deleteList);

export default router;
