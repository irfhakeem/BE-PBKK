import multer from "multer";
import path from "path";

const StorageAvatar = multer.diskStorage({
  destination: "./upload/avatar",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const StorageBanner = multer.diskStorage({
  destination: "./upload/banner",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const StorageThumbnail = multer.diskStorage({
  destination: "./upload/thumbnail",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const _UploadAvatar = multer({
  storage: StorageAvatar,
  limits: {
    fileSize: 2000000,
  },
});

const _UploadBanner = multer({
  storage: StorageBanner,
  limits: {
    fileSize: 10000000,
  },
});

const _UploadThumbnail = multer({
  storage: StorageThumbnail,
  limits: {
    fileSize: 10000000,
  },
});

export default {
  _UploadAvatar,
  _UploadBanner,
  _UploadThumbnail,
};
