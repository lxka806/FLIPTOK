const User = require("../models/Auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { username, name, email, password, bio } = req.body;

        let imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAkluRDQc6zWNeZmuBW6JX3JXg3hGpBwesaRLGKsWlA&s=10";

        if (req.file) {
            imageUrl = req.file.path;
        }

        // check duplicate user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            username,
            name,
            email,
            password: hashedPassword,
            bio,
            image: imageUrl
        });

        // create token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: "User created successfully",
            user,
            token
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
        message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                image: user.image,
                name: user.name,
                email: user.email,
                bio: user.bio,
                totalLikes: user.totalLikes,
                followers: user.followers,
                following: user.following,
                totalPosts: user.totalPosts
            },
            token
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const followUser = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const user = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!user || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // already following check
        if (user.followers.includes(currentUserId)) {
            return res.status(400).json({ message: "Already following" });
        }

        user.followers.push(currentUserId);
        currentUser.following.push(targetUserId);

        await user.save();
        await currentUser.save();

        res.status(200).json({ message: "Followed successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const unfollowUser = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const targetUserId = req.params.id;

        const user = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!user || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        user.followers = user.followers.filter(
            id => id.toString() !== currentUserId
        );

        currentUser.following = currentUser.following.filter(
            id => id.toString() !== targetUserId
        );

        await user.save();
        await currentUser.save();

        res.status(200).json({ message: "Unfollowed successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const logout = async (req, res) => {
    try{
        res.status(200).json({ message: "Logout successful" });
    }catch(err){
        res.status(500).json({ err: err.message})
    }
}

const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                image: user.image,
                name: user.name,
                email: user.email,
                bio: user.bio,
                totalLikes: user.totalLikes,
                followers: user.followers,
                following: user.following,
                totalPosts: user.totalPosts
            }
        });

    } catch (err) {
        console.error("getMe error:", err);
        res.status(500).json({ error: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({ users });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Search query is required" });
        }

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        }).select("-password").limit(20);

        res.status(200).json({ users });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                image: user.image,
                name: user.name,
                email: user.email,
                bio: user.bio,
                totalLikes: user.totalLikes,
                followers: user.followers,
                following: user.following,
                totalPosts: user.totalPosts
            }
        });

    } catch (err) {
        console.error("getUserById error:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { signup, login, logout, followUser, unfollowUser, getMe, getAllUsers, searchUsers, getUserById };