
import { Router } from 'express'
import { isLoggedin } from '../Middlewares/authMiddleware.js'
import { newNotification, getNotification, notificationCount } from '../Controllers/notificationController.js'
const router=Router()

router.get('/new-notification',isLoggedin,newNotification)
router.get('/get-notifications',isLoggedin,getNotification)
router.get('/notification-count',isLoggedin,notificationCount)

export default router