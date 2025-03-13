import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRoute from './routes/userRoute.js'
import newsRoutes from './routes/newsRoutes.js'
import 'dotenv/config'

const app = express()
const { FRONTEND_URL, PORT } = process.env

async function startServer() {
    if (!PORT || !FRONTEND_URL) {
        console.error('PORT and FRONTEND_URL values must not be empty for environment variables')
    }
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }))
    app.use(cors({
        origin: FRONTEND_URL,
        credentials: true,
    }));
    app.use('/user', userRoute)
    app.use('/news', newsRoutes)
    app.use("/images", express.static("src/dbConfig/seeds/news/images"));
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })
}

startServer();