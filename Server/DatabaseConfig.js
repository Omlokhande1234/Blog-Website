import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
//import blog from './Models/Blog.js'
const MONGODB_URL=process.env.MONGODB_URL 
const connectDB =() => {
    mongoose
    .connect(MONGODB_URL)
    .then((connect)=>console.log(`Database connected to ${connect.connection.host}`))
    .catch(err=> console.log(err));
}
export default connectDB