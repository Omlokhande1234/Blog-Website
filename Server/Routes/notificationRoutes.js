
import { Router } from 'express'
import { isLoggedin } from '../Middlewares/authMiddleware.js'
import { newNotification, notification, notificationCount } from '../Controllers/notificationController.js'
const router=Router()

router.get('/new-notification',isLoggedin,newNotification)
router.get('/notifications',isLoggedin,notification)
router.get('/notification-count',isLoggedin,notificationCount)

export default router