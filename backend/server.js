const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const userRouter = require('./routers/users.route')
const videoRouter = require('./routers/video.route')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))


app.use(express.json())
app.use(cookieParser())
app.use('/api/users', userRouter)
app.use('/api/videos', videoRouter)

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => {
        console.log('connected to MongoDB')
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    })