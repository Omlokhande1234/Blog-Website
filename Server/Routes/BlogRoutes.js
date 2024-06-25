import Router from 'express'
import { latestBlogs,searchBlog,trendingBlogs } from '../Controllers/BlogController.js'
const router=Router()
router.get('/latest-blogs',latestBlogs)
router.get('/trending-blogs',trendingBlogs)
router.get('/search-blogs',searchBlog)
export default router