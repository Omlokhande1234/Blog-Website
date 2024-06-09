import { Router } from "express";
import { google, signin, signout, signup } from "../Controllers/userController.js";
const route=Router()
route.post('/signup',signup)
route.post('/signin',signin)
route.get('/signout',signout)
route.post('/google',google)

export default route
