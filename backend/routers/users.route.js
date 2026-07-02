const express = require("express");
const router = express.Router();
const multer = require("multer");
const { signup, login, logout, followUser, unfollowUser, getMe, getAllUsers, searchUsers, getUserById } = require("../controllers/users.controller");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload")

router.post("/signup", upload.single("image"), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);
router.get("/all", getAllUsers);
router.get("/search", searchUsers);
router.get("/:userId", getUserById);
router.put("/follow/:id", authMiddleware, followUser);
router.put("/unfollow/:id", authMiddleware, unfollowUser);

module.exports = router;