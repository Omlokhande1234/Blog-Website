import mongoose, { connect } from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const MONGODB_URL=process.env.MONGODBURL
const dbConnection=()=>{
    mongoose
    .connect(MONGODB_URL)
    .then((connect)=>console.log(`Database connected to ${connect.connection.host}`))
    .catch((error)=>console.log(error.message))
}
export default dbConnection