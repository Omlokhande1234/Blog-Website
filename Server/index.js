import app from './app.js'
import dotenv from 'dotenv'
import dbConnection from './DatabaseConfig/DatabaseConfig.js'
dotenv.config()

const PORT=process.env.PORT
app.listen(PORT,async()=>{
    await dbConnection()
    console.log(`Server is running on the port ${PORT}`)
})