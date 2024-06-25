import Router from 'express'
import { addComment } from '../Controllers/commentController.js'
const router=Router()
router.post('/add-comment',addComment)

export default router