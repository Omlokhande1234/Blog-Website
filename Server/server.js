import connectDB from './DatabaseConfig.js';
import app from './app.js'
import dotenv from  'dotenv';
dotenv.config();
const PORT=process.env.PORT||3000
app.listen(PORT,async()=>{
    await connectDB()
    console.log(`Server is running at port ${PORT}`)
})