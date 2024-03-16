import users from '../Models/User.js'
import bcryptjs from 'bcryptjs'
import errorhandler from '../utils/errorUtils.js'
import jwt  from 'jsonwebtoken'

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

export const SignUp=async(req,res)=>{
    const{fullname,email,password}=req.body
    const hashPassword=await bcryptjs.hash(password,10)
    if(fullname.length<3){
        return next(errorhandler(400,'Full name should be at least three characters long'))
    }
    if(!email.length){
      return next(errorhandler(400,"Email is required"))
    }
    if(!password.length){
        return next(errorhandler(400,"Password is required"))
    }
    if(!emailRegex.test(email)){
        return next(errorhandler(400,'Enter valid email'))

    }
    if(!passwordRegex.test(password)){
        return next(errorhandler(400,'Enter valid password'))
    }
    let username=email.split("@")[0]
    const newUser=new users({
        personal_info:{
            fullname,
            email,
            password:hashPassword,
            username
        }
    })
    try {
        await newUser.save();
        res.status(201).json({
            success:true,
            newUser
        }
        );
     } catch (error) {
         if(error.code == 11000) {
             return next(errorhandler(500,'Email already exxists'))
         }
        return res.status(404).json(error.message);
     }

}

export const SignIn=async(req,res,next)=>{
    const{email,password}=req.body
   try{
    if(!email||!password){

    }
    const user= await users.findOne({'personal_info.email':email})
   }catch(error){

   }

}
export const LogOut=async(req,res)=>{}