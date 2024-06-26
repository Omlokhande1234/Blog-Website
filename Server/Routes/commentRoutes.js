import Router from 'express'
import { addComment, getBlogComments } from '../Controllers/commentController.js'
import { isLoggedin } from '../Middlewares/authMiddleware.js'
const router=Router()
router.post('/add-comment',isLoggedin,addComment)
router.get('/getBlog-comments',getBlogComments)

export default router