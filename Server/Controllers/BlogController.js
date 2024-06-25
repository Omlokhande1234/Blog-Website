import Blogs from '../Models/blogModel.js'
import Notification from '../Models/NotificationModel.js'
import User from '../Models/userModel.js'
import { errorhandler } from '../utils/errorHandler.js'

export const latestBlogs=async(req,res,next)=>{
    const maxLimit=5
    try{
        await Blogs.find({draft:false})
        .populate("author","personal_info.avatar personal_info.username -_id")
        .sort({"publishedAt":-1})
        .select("blog_id title des banner activity tags publishedAt -_id")
        .limit(maxLimit)
        .then(blogs=>{
            return res.status(200).json({
                success:true,
                message:"Latest blogs fetched successfully",
                blogs
            })
        })
        .catch(error=>{
            return next (errorhandler(400,error.message))
        })
    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
export const trendingBlogs=async(req,res,nect)=>{
    const maxLimit=5
    try{
        const blogs=await Blogs.find({draft:false})
        .populate("author","personal_info.avatar personal_info.username -_id")
        .sort({"activity.total_likes":-1,"activity.total_likes":-1,"publishedAt":-1})
        .select("blog_id title  publishedAt -_id")
        .limit(maxLimit)
        .then(blogs=>{
            return res.status(200).json({
                success:true,
                message:"Trending blogs fetched successfully",
                blogs
            })
        })
        .catch(error=>{
            return next(errorhandler(400,error.message))
        })

    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
export const searchBlog=async(req,res,next)=>{
    const{query,tag,page}=req.body
    try{
        let findQuery
        if(tag){
            findQuery={tags:tag,draft:false}
        }
        else if(query){
            findQuery={draft:false,title:new RegExp(query,'i')}
        }
        await Blogs.find(findQuery)
        .populate("author","personal_info.avatar personal_info.username -_id")
        .sort({"publishedAt":-1})
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page-1)*2)
        .limit(2)
        .then(blogs=>{
            return res.status(200).json({
                success:true,
                message:"searched Blogs successfully",
                blogs
            })
        })
        .catch(error=>{
            return next(errorhandler(400,error.message))
        })

    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
export const getBlog=async(req,res,next)=>{
    const{blog_id}=req.body
    try{
        //FindOne and update dont give us the current document it gives us the one doc behind
        //i.e if our increement val=4 then it show us its prev doc i.e the total read will be 3 
        //how to get accurate reads we will see further
        let increementVal=1
        //here we update the total reads of the blog
        Blogs.findOneAndUpdate({blog_id},{$inc:{"activity.total_reads":increementVal}})
        .populate("author","personal_info.username personal_info.avatar")
        .select("title des banner content activity tags publishedAt blog_id")
        .then(blog=>{
            //Now to update the total reads from the user account_info
            User.findOneAndUpdate({"personal_info.username":blog.author.personal_info.username},
                {$inc:{"account_info.total_reads":increementVal}})
                .catch(error=>{
                return next(errorhandler(400,error.message))
            })
            res.status(200).json({
                success:true,
                message:"Bloged fetche successfully",
                blog
            })
        })
        .catch(error=>{
            return next(errorhandler(400,error.message))
        })

    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}
//this like blog only likes the blog and increements the like inside the database
//but dont give us the info about the user
export const likeBlog=async(req,res,next)=>{
    const user_id=req.user.id
    let{_id,islikedUser}=req.body
    //Here if the blog is not liked by the user then take increementVal as 
    //1 and if the user has liked the blog then take the increementVal as -1

    let increementVal=!islikedUser?1:-1
    Blogs.findOneAndUpdate({_id},{$inc:{"activity.total_likes":increementVal}})
    .then(blog=>{
        if(!islikedUser){
            let like=new Notification({
                type:"like",
                blog:_id,
                notification_for:blog.author,
                user:user_id
            })
            like.save()
            .then(notification=>{
                return res.status(200).json({
                    liked_By_User:true,
                    success:true,
                    message:"Like the blog successfully",
                    notification
                })

            }).catch(error=>{
                return next(errorhandler(400,error.message))
            })
        }
        else{
            Notification.findOneAndDelete({user:user_id,blog:_id,type:"like"})
            .then(data=>{
                return res.json({liked_By_User:false})
            })
            .catch(error=>{
                return next(errorhandler(400,error.message))
            })
        }
    })
}
//this route helps us to send which user has liked the blog
export const isLikedByUser=async(req,res)=>{
    let user_id=req.user.id
    let {_id}=req.body
    Notification.exists({user:user_id, type:"like",blog:_id})
    .then(result=>{
        console.log(result)
        return res.status(200).json({result})
    })
    .catch(error=>{
        return next(errorhandler(400,error.message))
    })
}