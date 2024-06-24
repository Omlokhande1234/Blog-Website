import User from '../Models/userModel.js'
import { errorhandler } from '../utils/errorHandler.js'
import fs from 'fs/promises'
import cloudinary from 'cloudinary'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

const cookieOption={
    secure:true,
    maxAge:7*24*60*60*1000,
    httpOnly:true
}
export const signup=async(req,res,next)=>{
    const{username,email,password,bio}=req.body
    try{
        if(!username||!email||!password){
            return next(errorhandler(400,"All the fields are required"))
        }
        const userExists=await User.findOne({email})
        if(userExists){
            return next(errorhandler(400,"User already exists"))
        }
        const hashedPassword=bcrypt.hashSync(password,12)
        const user=await new User({
            personal_info:{
                username,
                email,
                password:hashedPassword,
                avatar:{
                   public_id:email,
                   secure_url:"https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg"
                },
                bio
            }
           
        })
        if(!user){
            return next(errorhandler(400,"User not cretaed successfully"))
        }
        if(req.file){
            try{
                console.log(`req fille multer:-` , req.file)
                const result=await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'Blog',
                    width:250,
                    height:250,
                    gravity:'faces',
                    crop:'fill'
                })
                if(result){
                    user.personal_info.avatar.public_id=result.public_id
                    user.personal_info.avatar.secure_url=result.secure_url

                    fs.rm(`uploads/${req.file.filename}`)
                }
            }
            catch(error){
                return next(errorhandler(400,error.message))
            }

        }
        await user.save()
        user.password=undefined
        const token=await user.generateJWTTOKEN()
        res.cookie('token',token,cookieOption)
        res.status(200).json({
            success:true,
            message:"User created Successfully",
            user
        })
       
    }
    catch(error){
        console.log(error)
        return next(errorhandler(400,error.message))
    }
}
export const signin=async(req,res,next)=>{
    const{username,email}=req.body
    try{
        if(!username||!email){
            return next(errorhandler(400,"All the fields are required"))
        }
        const user=await User.findOne({email}.select('+password'))
        if(!user||!bcrypt.compareSync(password,user.password)){
            return next(errorhandler(400,"Invalid email or password"))
        }
        const token=user.generateJWTTOKEN()
        res.cookie('token',token,cookieOption)
        res.status(200).json({
            success:true,
            message:"User logged in succesfully",
            user
        })
    }
    catch(error){
        return next(errorhandler(400,error.message))
    }

}
export const signout=(res,req,next)=>{
   try{
    res.clearcookie('token')
    res.status(200).json("User LoggedOut Successfully")
   }
   catch(error){
    return next(errorhandler(400,error.message))
   }
}
export const google=async(req,res,next)=>{
    try{
        const user=await User.findOne({email})
        if(user){
            const token=user.generateJWTTOKEN()
            res.cookie('token',token,cookieOption)
        }
        else{
            const generatedpassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
            const hashedPassword=bcrypt.hashSync(generatedpassword,10)
            const newUser=new User({username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashedPassword,avatar:req.body.photo})
            await newUser.save()
            const token=newUser.generateJWTTOKEN()
            res.cookie('token',token,cookieOption)
            console.log(newUser._doc)
        }
    }
    catch(error){
        return next(errorhandler(400,error.message))
    }

}