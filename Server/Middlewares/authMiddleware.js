import dotenv from "dotenv";
import { errorhandler } from "../utils/errorHandler.js";
import jwt from 'jsonwebtoken'
dotenv.config()
export const isLoggedin=(req,res,next)=>{
    const {token}=req.cookies
    try{
        if(!token){
            return next(errorhandler(400,"Unauthorized as no token present"))
        }
        const userDetails=jwt.verify(token,process.env.SECRET)
        if(!userDetails){
            return next(errorhandler(400,"User details not able to fetch"))
        }
        req.user=userDetails
        next()
    }
    catch(error){
        console.log(error.message)
        return next(errorhandler(400,error.message))
    }
}
