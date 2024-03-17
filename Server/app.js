import express from 'express'
import cors from 'cors'
const app=express()
import authRoutes from './Routes/authRoutes.js'


app.use(express.json())
app.use(cors({
    origin:'*',
    credentials:true
    }) 
)
app.use('/api/auth',authRoutes)



export default app 
