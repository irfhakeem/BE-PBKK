import express from "express";
import storageController from "../controller/storage.controller.js";
import authenticate from "../middleware/middleware.js";

const router = express.Router();
router.post(
  "/upload/avatar",
  authenticate,
  storageController._UploadAvatar.single("avatar"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }
    res.status(200).send({
      message: "File uploaded successfully",
      file: `${process.env.HOST}:${process.env.PORT}/avatar/${req.file.filename}`,
    });
  }
);

router.post(
  "/upload/banner",
  authenticate,
  storageController._UploadBanner.single("banner"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }
    res.status(200).send({
      message: "File uploaded successfully",
      file: `${process.env.HOST}:${process.env.PORT}/banner/${req.file.filename}`,
    });
  }
);

router.post(
  "/upload/thumbnail",
  authenticate,
  storageController._UploadThumbnail.single("thumbnail"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }
    res.status(200).send({
      message: "File uploaded successfully",
      file: `${process.env.HOST}:${process.env.PORT}/thumbnail/${req.file.filename}`,
    });
  }
);

export default router;
