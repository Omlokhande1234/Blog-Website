import Notification from "../Models/NotificationModel.js";
import User from "../Models/userModel.js";
import { errorhandler } from "../utils/errorHandler.js";

export const newNotification=async(req,res,next)=>{
    let user_id=req.user.id
    //here we are finding the notification for the user where the notificationshould
    //not be of the existing user as the user will get notification for its own activity

    Notification.exists({notification_for:user_id,seen:false,user:{$ne:user_id}})
    .then(result=>{
        if(result){
            return res.status(200).json({
               
                newNotification_is_available:true
            })
        }
        else{
            return res.status(200).json({
               newNotification_is_available:false
            })
        }
    })
    .catch(error=>{
         return next(errorhandler(400,error,message))
    })
}
export const getNotification=(req,res,next)=>{
    let user_id=req.user.id
    let{page,filter,deleteCount}=req.body
    let maxlimit=10
    let findQuery={notification_for:user_id,user:{$ne:user_id}}
    let skipDocs=(page-1)*maxlimit
    if(filter!=='all'){
        findQuery.type=filter
    }
    if(deleteCount){
        skipDocs-=deleteCount
    }
    Notification.find(findQuery)
    .skip(skipDocs)
    .limit(maxlimit)
    .populate("blog","title blog_id")
    .populate("user","personal_info.username personal_info_avatar")
    .populate("comment","comment")
    .populate("replied_on_comment",'comment')
    .populate("reply","comment")
    .sort({createdAt:-1})
    .select("createdAt type seen reply")
    .then(notifications=>{
        Notification.updateMany(findQuery,{seen:true})
        .skip(skipDocs)
        .limit(maxlimit)
        .then(seen=>console.log("Notification seen"))
        return res.status(200).json({notifications})
    })
    .catch(error=>{
        return next(errorhandler(400,error.message))
    })
}
export const notificationCount=(req,res,next)=>{
    let user_id=req.user.id
    let {filter}=req.body
    let findQuery={notification_for:user_id,user:{$ne:user_id}}
    if(filter!=='all'){
        findQuery.type=filter
    }
    Notification.countDocuments(findQuery)
    .then(count=>{
        return res.status(200).json({
            success:true,
            message:"fetched total notifications",
            count
        })
    })
    .catch(error=>{
        return next(errorhandler(400,error.message))
    })
}