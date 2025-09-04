const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Accept only jpeg, jpg, png
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".jpeg", ".jpg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true); // accept file
  } else {
    cb(new Error("Only JPEG, JPG, and PNG files are allowed"), false); // reject file
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
