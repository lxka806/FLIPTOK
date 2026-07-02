const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        caption: {
            type: String,
            maxlength: 300,
        },
        videoUrl: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);