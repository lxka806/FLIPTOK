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
            user,
            token
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = { signup, login };