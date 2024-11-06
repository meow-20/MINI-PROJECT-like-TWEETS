const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/upload");
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, bytes) {
      cb(null, bytes.toString("hex") + path.extname(file.originalname));
    });
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
