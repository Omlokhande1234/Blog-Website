import app from './app.js'
import dotenv from 'dotenv'
import dbConnection from './DatabaseConfig/DatabaseConfig.js'
import cloudinary from 'cloudinary'
dotenv.config()


cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEYS,
    api_secret:process.env.CLOUDINARY_SECRET
})
const PORT=process.env.PORT
app.listen(PORT,async()=>{
    await dbConnection()
    console.log(`Server is running on the port ${PORT}`)
})