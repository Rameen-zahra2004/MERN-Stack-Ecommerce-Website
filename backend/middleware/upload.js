import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads/");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const MAX_IMAGES_PER_PRODUCT = 8;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const safeName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9.\-]/g, "");

    const uniqueId = crypto.randomUUID();

    cb(null, `${uniqueId}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isValidMime = ALLOWED_MIME_TYPES.includes(file.mimetype);

  const ext = path.extname(file.originalname).toLowerCase();
  const isValidExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext);

  if (isValidMime && isValidExt) {
    return cb(null, true);
  }

  return cb(new Error("Only JPG, JPEG, PNG, WEBP allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: MAX_IMAGES_PER_PRODUCT, // max files per single upload request
  },
});

export const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};

export default upload;
