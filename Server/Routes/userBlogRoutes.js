import {Router} from 'express'
import { createBlog } from '../Controllers/UserBlogController.js'
import { isLoggedin } from '../Middlewares/authMiddleware.js'
import upload from '../Middlewares/multerMiddleware.js'

const router=Router()
router.post('/createBlog',isLoggedin,upload.single('banner'),createBlog)

export default router