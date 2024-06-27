import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authroutes from './Routes/authRoutes.js'
import userblogroutes from './Routes/userBlogRoutes.js'
import blogRoutes from './Routes/BlogRoutes.js'
import commentRoutes from './Routes/commentRoutes.js'
import notificationRoutes from './Routes/notificationRoutes.js'
import errorMiddleware from './Middlewares/errorMiddleware.js'

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:'*',
    credentials:true
}))
app.use(cookieParser())
//app.use(errorMiddleware())

app.use('/user',authroutes)
app.use('/userblog',userblogroutes)
app.use('/blogs',blogRoutes)
app.use('/blogs',commentRoutes)
app.use('/notifications',notificationRoutes)
app.use(errorMiddleware)


export default app

