import Router from 'express'
import { DeleteComments, addComment, getBlogComments, getCommentReplies } from '../Controllers/commentController.js'
import { isLoggedin } from '../Middlewares/authMiddleware.js'
const router=Router()
router.post('/add-comment',isLoggedin,addComment)
router.get('/getBlog-comments',getBlogComments)
router.get('/getComment-replies',getCommentReplies)
router.delete('/delete-comments',isLoggedin,DeleteComments)

export default router