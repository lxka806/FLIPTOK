const express = require('express')
const videoRouter = express.Router()
const authMiddleware = require("../middleware/auth");
const uploadVideo = require("../middleware/uploadVideo");
const {
    uploadVideoController,
    getAllVideos,
    getUserVideos,
    likeVideo,
    unlikeVideo,
    addComment,
    getVideoDetails,
    deleteVideo,
    searchVideos
} = require("../controllers/video.controller");

// Video upload and retrieval
videoRouter.post("/upload", authMiddleware, uploadVideo.single("video"), uploadVideoController);
videoRouter.get("/all", getAllVideos);
videoRouter.get("/search", searchVideos);
videoRouter.get("/user/:userId", getUserVideos);
videoRouter.get("/:videoId", getVideoDetails);

// Likes
videoRouter.put("/:videoId/like", authMiddleware, likeVideo);
videoRouter.put("/:videoId/unlike", authMiddleware, unlikeVideo);

// Comments
videoRouter.post("/:videoId/comment", authMiddleware, addComment);

// Delete
videoRouter.delete("/:videoId", authMiddleware, deleteVideo);

module.exports = videoRouter;
