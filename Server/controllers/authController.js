import users from '../Models/User.js'
import bcryptjs from 'bcryptjs'
import jwt  from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

export const SignUp=async(req,res)=>{
    const{fullname,email,password}=req.body
    const hashPassword=await bcryptjs.hash(password,10)
    if(fullname.length<3){
        return res.status(400).json({
            success:false,
            messgae:"fullname  should be at least 3 characters long"
        })
    }
    if(!email.length){
        return res.status(400).json({
            success:false,
            messgae:"email is required"
        })
    }
    if(!password.length){
        return res.status(400).json({
            success:false,
            messgae:"password is required"
        })
    }
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            messgae:"enter valid email"
        })

    }
    if(!passwordRegex.test(password)){
        return res.status(400).json({
            success:false,
            messgae:"enter valid password"
        })
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
            return res.status(400).json({
                success:false,
                messgae:"Email already exists"
            })
         }
        return res.status(404).json(error.message);
     }

}

export const SignIn=async (req,res,next)=>{
    const {email,password}=req.body;
    try {        
    const validUser=await users.findOne({"personal_info.email" : email})
    if(!validUser) return res.status(404).json(
        {
            success:false,
            error:"User not found"
        }
        );

    const validPassword=bcryptjs.compareSync(password,validUser.personal_info.password);
    if(!validPassword) return res.status(404).json({
        success:false,
        error:"Invalid password"
    });
    // const token=jwt.sign({id:users._id,email:users.email},process.env.SECRET);
    // const {password:pass,...rest}=users._doc
    // res.cookie('token',token,{httpOnly:true}).status(200).json(rest);

    res.status(200).json({
        success:true,
        message:"User logged in successfully",
        validUser
    });

    } catch (error) {
        return res.status(404).json(error)
    }
}
export const LogOut=async(req,res)=>{}