import {Router} from 'express'
import { SignUp,SignIn,LogOut } from '../controllers/authController.js'
const router=Router()

router.post('/signup',SignUp)
router.post('/signin',SignIn)
router.get('/logout',LogOut)


export default router

