import {Router} from 'express'
import { SearchUser, createBlog, editBlog } from '../Controllers/UserBlogController.js'
import { isLoggedin } from '../Middlewares/authMiddleware.js'
import upload from '../Middlewares/multerMiddleware.js'

const router=Router()
router.post('/createBlog',isLoggedin,upload.single('banner'),createBlog)
router.get('/search-user',SearchUser)
router.put('/edit-blog',isLoggedin,editBlog)

export default router