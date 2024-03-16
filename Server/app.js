import express from 'express'
import cors from 'cors'
const app=express()
import authRoutes from './Routes/authRoutes.js'
import errorMiddleware from './Middleware/errorMiddlewares.js'

app.use(express.json())
app.use(cors())
app.use('/api/auth',authRoutes)
app.use(errorMiddleware())


export default app 
