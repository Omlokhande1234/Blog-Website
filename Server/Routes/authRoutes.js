import { Router } from "express";
import upload from '../Middlewares/multerMiddleware.js'
import { google, signin, signout, signup } from "../Controllers/userController.js";
const route=Router()
route.post('/signup',upload.single("avatar"),signup)
route.post('/signin',signin)
route.get('/signout',signout)
route.post('/google',google)

export default route
