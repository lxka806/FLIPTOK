const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "videos",
        resource_type: "video",
        allowed_formats: ["mp4", "mov", "avi", "webm", "mkv"],
    },
});

module.exports = multer({ storage });