const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const userRouter = require('./routers/users.route')
const cookieParser = require('cookie-parser')

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use('/api/users', userRouter)


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connected to MongoDB')
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })