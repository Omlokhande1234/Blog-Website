import Router from 'express'
import { latestBlogs,trendingBlogs } from '../Controllers/BlogController.js'
const router=Router()
router.get('/latest-blogs',latestBlogs)
router.get('/trending-blogs',trendingBlogs)
export default router