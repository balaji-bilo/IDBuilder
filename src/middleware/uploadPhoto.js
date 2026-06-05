const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req, file) => {
      // Create folder structure: passport-photos/YYYY/MM/DD
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      return `passport-photos/${year}/${month}/${date}`;
    },
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) =>
      `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

const uploadPhoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = uploadPhoto;