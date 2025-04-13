import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongo_url)
        console.log('DB connected ..')
    } catch (error) {
        console.log('error in connected ..')
        console.log(error)
    }
}