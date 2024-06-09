import express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import authroute from './Routes/authRoutes.js'
const app=express()
app.use(express.json())
app.use(cors({
    origin:'*',
    credentials:true
}))
app.use(cookieparser())
app.use('/api/auth',authroute)

export default app

