import User from '../Models/userModel.js'
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
import { nanoid } from "nanoid";
import Blogs from '../Models/blogModel.js' 
import { errorhandler } from '../utils/errorHandler.js'

export const createBlog=async(req,res,next)=>{
    try{
        const authorId=req.user.id
        const{title,des,content,tags,draft}=req.body
        if(!title||!des||!content||!tags){
            return next(errorhandler(400,"All the fields are required"))
        }
        let blog_id=title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();
        const blog=await new Blogs({
           
           blog_id,
           title,
           banner:{
              public_id:title,
              secure_url:'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
           },
           des,
           content,
           tags,
           draft:Boolean(draft),
           author:authorId,
        })
        if(!blog){
            return next(errorhandler(400,"Blog not created"))
        }
        if(req.file){
            try{
                const result=await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:"Blog"
                })
                if(!result){
                    return next(errorhandler(400,"Error in uploading the image"))
                }
                blog.banner.public_id=result.public_id
                blog.banner.secure_url=result.secure_url
                fs.rm(`uploads/${req.file.filename}`)
            }
            catch(error){
                
                return next(errorhandler(400,error.message))
            }
        }
        blog.save().then(blog=>{
            let incrementval=draft?0:1
            User.findOneAndUpdate(
                {_id:authorId},
                {
                  $inc:{"account_info.total_posts":incrementval},
                  $push:{"blog":blog_id}
                }
            )
            .then(user=>{return res.status(200).json
                ({
                  success:true,
                  blogId:blog.blog_id,
                  message:"Blog created successfully",
                  blog
                })
            })
            .catch(error=>{
                return next(errorhandler(400,error.message))
            })

        })
    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}