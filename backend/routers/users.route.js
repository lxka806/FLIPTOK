const express = require("express")
const userRouter = express.Router()
const upload = require("../middleware/upload")

const { signup, login } = require('../controllers/users.controller') 

userRouter.post("/signup", upload.single("image"), signup);
userRouter.post("/login", login);

module.exports = userRouter