import users from '../Models/User.js'
import bcryptjs from 'bcryptjs'
import jwt  from 'jsonwebtoken'

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

export const SignUp=async(req,res)=>{
    const{fullname,email,password}=req.body
    const hashPassword=await bcryptjs.hash(password,10)
    if(fullname.length<3){
        return res.status(400).json({
            success:"false",
            error:'Full name must be at least 3 characters long.'
            
        })
    }
    if(!email.length){
        return res.status(400).json({
            success:"false",
            error: "Email is required."
        })
    }
    if(!password.length){
        return res.status(400).json({
            success:"false",
            error:"Password is required"
        })
    }
    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:"false",
            error:"Email is invalid"
        })

    }
    if(!passwordRegex.test(password)){
        return res.status(400).json({
            success:"false",
            error:"password is invalid"
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
             return res.status(500).json({
                 success:false,
                 error:"Email is already exists!"
             })
         }
        return res.status(404).json(error.message);
     }

}

export const SignIn=async(req,res)=>{}
export const LogOut=async(req,res)=>{}