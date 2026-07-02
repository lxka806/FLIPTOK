const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validator.isEmail, 'Please enter a valid email']
        },
        password: {
            type: String,
            required: true
        },
        bio:{
            type: String,
            maxlength: [200, 'Bio cannot be more than 200 characters']
        },
        image:{
            type: String,
            default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAkluRDQc6zWNeZmuBW6JX3JXg3hGpBwesaRLGKsWlA&s=10'
        },
        totalLikes: {
            type: Number,
            default: 0
        },
        folowes: {
            type: Number,
            default: 0
        },
        Posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post'
            }
        ],
        totalPosts: {
            type: Number,
            default: 0
        }

    },
    {
        timestamps: true
    }
)

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema);

module.exports = User;