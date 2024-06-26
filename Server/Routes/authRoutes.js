import { Router } from "express";
import upload from '../Middlewares/multerMiddleware.js'
import { changePassword, getProfile, google, signin, signout, signup } from "../Controllers/userController.js";
import { isLoggedin } from "../Middlewares/authMiddleware.js";
const route=Router()
route.post('/signup',upload.single("avatar"),signup)
route.post('/signin',signin)
route.get('/signout',signout)
route.post('/google',google)
route.post('/change-password',isLoggedin,changePassword)
route.get('/get-profile',getProfile)

export default route
