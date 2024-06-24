import Blogs from '../Models/blogModel.js'
import { errorhandler } from '../utils/errorHandler.js'

export const latestBlogs=async(req,res,next)=>{
    const maxLimit=5
    try{
        Blogs.find({draft:false})
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
        Blogs.find({draft:false})
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