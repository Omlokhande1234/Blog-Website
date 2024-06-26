import comments from '../Models/commentModel.js'
import { errorhandler } from '../utils/errorHandler.js'
import Notification from '../Models/NotificationModel.js'
import Blogs from '../Models/blogModel.js'

export const addComment=async(req,res,next)=>{
    const user_id=req.user.id
    const{_id,comment,replying_to,blog_author}=req.body
    if(!comment.length){
        return next(errorhandler(400,"Comment is required"))
    }
    let commentObj={blog_id:_id,blog_author,comment,commented_by:user_id}
    //If we get the replying_to from the frontend where replying_to is the id of 
    //the comment we are replying to then we will add the reply to the comment
    if(replying_to){
        //Here we are setting the parent comment to the id(replying_to) of the comment we got
        //from the frontend where the user is trying to reply
        commentObj.parent=replying_to
        commentObj.isReply=true
    }
    let increement=1
    new comments(commentObj).save().then(async commentFile=>{
        //children refers to the reply to the comments
        let {comment,commentedAt,children}=commentFile
        Blogs.findOneAndUpdate({_id},
            {
                $push:{"comments":commentFile._id},
                $inc:{"activity.total_comments":increement,
                "activity.total_parent_comments":replying_to?0:increement}
            }
            
        ).then(blog=>{console.log('New comment created')})
         .catch(error=>{console.log(error)})
         let notificationObj={
            type:replying_to?"reply":"comment",
            blog:_id,
            notification_for:blog_author,
            user:user_id,
            comment:commentFile._id
         }
         if(replying_to){
            notificationObj.replied_on_comment=replying_to

            await comments.findOneAndUpdate({_id:replying_to},
                {$push:{children:commentFile._id}}
            ).then(replyingTOComment=>
                {notificationObj.notification_for=replyingTOComment.commented_by})

         }
         new Notification(notificationObj).save()
         .then(notification=>console.log('new notification created'))
         .catch(error=>console.log(error.message))

         return res.status(200).json({
            success:true,
            message:"Comment created successfully",
            comment,
            commentedAt,
            _id:commentFile._id,
            children,
            user_id
         })


    })

}
export const getBlogComments=async(req,res,next)=>{
    let {blog_id,skip}=req.body
    let maxLimit=5
    try{
       comments.find({blog_id,isReply:false})
               .populate("commented_by","personal_info.username personal_info.avatar")
               .limit(maxLimit)
               .sort({createdAt:-1})
               .skip(skip)
               .then(comments=>{
                return res.status(200).json({
                    success:true,
                    message:"Fetched comments successfully",
                    comments
                })

               })
               .catch(error=>{
                console.log(error)
                return next(errorhandler(400,error.message))
               })

    }
    catch(error){
        return next(errorhandler(400,error.message))
    }
}