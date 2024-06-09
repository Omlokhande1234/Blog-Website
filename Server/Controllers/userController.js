import User from '../Models/userModel.js'
import { errorhandler } from '../utils/errorHandler.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()


export const signup=async(req,res,next)=>{
    const[username,email,password]=req.body
    try{
        if(!username||!email||!password){
            return next(errorhandler(400,"All the fields are required"))
        }
        const userExists=await User.findOne({email})
        if(userExists){
            return next(errorhandler(400,"User already exists"))
        }
        const hashedPassword=bcrypt.hashSync(password,10)
        const user=await User.create({
            username,
            email,
            password:hashedPassword
        })
        if(!user){
            return next(errorhandler(400,"User not cretaed successfully"))
        }
        await user.save()
        user.password=undefined
        res.status(200).json({
            success:true,
            message:"User created Successfully",
            user
        })
       
    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
export const signin=async(req,res,next)=>{
    const[username,email]=req.body
    try{
        if(!username||!email){
            return next(errorhandler(400,"All the fields are required"))
        }
        const user=await User.findOne({email}.select('+password'))
        if(!user||!bcrypt.compareSync(password,user.password)){
            return next(errorhandler(400,"Invalid email or password"))
        }
        const token=jwt.sign({id:user._id,email:user._email},process.env.SECRET)
        const{password:pass,...rest}=user._doc
        res.cookie('token',token,{httpOnly:true}).status(200).json(rest)
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
    return next(400,error.message)
   }
}
export const google=async(req,res,next)=>{
    try{
        const user=await User.findOne({email})
        if(user){
            const token=jwt.sign({id:user._id,email:user.email},process.env.SECRET)
            const{password,...rest}=user._doc
            res.cookie('token',token,{httpOnly:true}).status(200).json(rest)
        }
        else{
            const generatedpassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
            const hashedPassword=bcrypt.hashSync(generatedpassword,10)
            const newUser=new User({username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashedPassword,avatar:req.body.photo})
            await newUser.save()
            const token=jwt.sign({id:newUser._id,email:newUser_email},process.env.SECRET)
            const{password,...rest}=newUser._doc
            res.cookie('token',token,{httpOnly:true}).status(200).json(rest)
            console.log(newUser._doc)
        }
    }
    catch(error){
        return next(errorhandler(400,error.message))
    }

}