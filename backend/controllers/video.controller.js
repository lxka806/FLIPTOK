const Video = require("../models/Posts");
const Comment = require("../models/Comment");
const User = require("../models/Auth");

// Upload video
const uploadVideoController = async (req, res) => {
    try {
        const { caption } = req.body;
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: "No video file uploaded" });
        }

        const video = await Video.create({
            caption: caption || "",
            videoUrl: req.file.path,
            user: userId,
            likes: [],
            comments: [],
        });

        // Add video to user's posts
        await User.findByIdAndUpdate(userId, {
            $push: { Posts: video._id },
            $inc: { totalPosts: 1 }
        });

        const populatedVideo = await video.populate("user", "username image name");

        res.status(201).json({
            message: "Video uploaded successfully!",
            video: populatedVideo,
        });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get all videos (for feed)
const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find()
            .populate("user", "username image name _id")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "username image"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ videos });
    } catch (err) {
        console.error("Get videos error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get user's videos
const getUserVideos = async (req, res) => {
    try {
        const { userId } = req.params;

        const videos = await Video.find({ user: userId })
            .populate("user", "username image name _id")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "username image"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ videos });
    } catch (err) {
        console.error("Get user videos error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Like video
const likeVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user.id;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Check if already liked
        if (video.likes.includes(userId)) {
            return res.status(400).json({ message: "Already liked this video" });
        }

        video.likes.push(userId);
        await video.save();

        res.status(200).json({ message: "Video liked!", likes: video.likes.length });
    } catch (err) {
        console.error("Like error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Unlike video
const unlikeVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user.id;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        video.likes = video.likes.filter(id => id.toString() !== userId);
        await video.save();

        res.status(200).json({ message: "Video unliked!", likes: video.likes.length });
    } catch (err) {
        console.error("Unlike error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Add comment
const addComment = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const comment = await Comment.create({
            text,
            user: userId,
            video: videoId,
        });

        video.comments.push(comment._id);
        await video.save();

        const populatedComment = await comment.populate("user", "username image");

        res.status(201).json({
            message: "Comment added!",
            comment: populatedComment,
        });
    } catch (err) {
        console.error("Add comment error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get video details
const getVideoDetails = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId)
            .populate("user", "username image name _id")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "username image"
                }
            });

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({ video });
    } catch (err) {
        console.error("Get video details error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Delete video
const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user.id;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Check if user owns the video
        if (video.user.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this video" });
        }

        await Video.findByIdAndDelete(videoId);
        await User.findByIdAndUpdate(userId, {
            $pull: { Posts: videoId },
            $inc: { totalPosts: -1 }
        });

        res.status(200).json({ message: "Video deleted successfully!" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Search videos by caption
const searchVideos = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Search query is required" });
        }

        const videos = await Video.find({
            caption: { $regex: query, $options: "i" }
        })
            .populate("user", "username image name _id")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "username image"
                }
            })
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ videos });
    } catch (err) {
        console.error("Search videos error:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    uploadVideoController,
    getAllVideos,
    getUserVideos,
    likeVideo,
    unlikeVideo,
    addComment,
    getVideoDetails,
    deleteVideo,
    searchVideos
};

