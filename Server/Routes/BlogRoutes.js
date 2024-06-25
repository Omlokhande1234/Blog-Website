import Router from 'express'
import { isLoggedin } from '../Middlewares/authMiddleware.js'
import { getBlog, isLikedByUser, latestBlogs,likeBlog,searchBlog,trendingBlogs } from '../Controllers/BlogController.js'
const router=Router()
router.get('/latest-blogs',latestBlogs)
router.get('/trending-blogs',trendingBlogs)
router.get('/search-blogs',searchBlog)
router.get('/get-blog',getBlog)
router.post('/like-blog',isLoggedin,likeBlog)
router.post('/likedBy-user',isLoggedin,isLikedByUser)
export default router