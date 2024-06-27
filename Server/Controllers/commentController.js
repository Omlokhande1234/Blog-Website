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
export const getCommentReplies=async(req,res,next)=>{
    const{_id,skip}=req.body
    let maxLimit=5
    comments.findOne({_id})
    .populate({
        path:"children",
        options:{
            limit:maxLimit,
            skip:skip,
            sort:{'commentedAt':-1}
        },
        populate:{
            path:"commented_by",
            select:"personal_info.username personal_info.avatar"
        },
        //Here we have not selectedd the blog id as the blog id of the comment 
        //reply on the comment is same and updatedAt is not needed
        select:"-blog_id -updatedAt"
    })
    //Here we have selected the children as we only want the reply of the comments
    .select("children")
    //Here as we will get the comment that we want and then from comment we have to 
    //seperate the children from the founded comment
    .then(doc=>{
        return res.status(200).json({
            success:true,
            message:"Fetched replies successfully",
            replies:doc.children
        })
    })
}

const deleteComments=(_id)=>{
    //Here we will get the comment of the passsed id and then we can find that
    //comment and then we can delete that comment
    comments.findOneAndDelete({_id})
    .then(comment=>{
        //Here as these comment has the parent key the comment we are deleting
        //here is the reply it means we have to delete this comment from array of 
        //children of the parent comment
        if(comment.parent){
            //Here as we are deleting the reply first we will find the parent comment
            //and then we will delete the reply from the children array of the 
            //parent comment using the pull function
            //Here while finding the parent comment we have taken _id as comment.parent
            //as we have given the id of the parent comment to comment.parent as replying_to
            //while creating the comment
            return comments.findOneAndUpdate({_id:comment.parent},{$pull:{children:_id}})
            .then(data=>console.log('reply comment is deleted from parent comment'))
            .catch(error=>console.log(error.message))
        }
         //Now deleting the comment and reply on comment notification
            
            //Here we will the find the comment notification whose id we be matched with
            //the comment id that we want to delete and then we will delete that comment
            // notification
            Notification.findOneAndDelete({comment:_id}).then(notification=>console.log("Comment notification deleted successfully"))
            //here we will match the reply id 
            Notification.findOneAndDelete({reply:_id}).then(notification=>console.log('Reply of the comment deleted successfully'))

            //Now removing the comments from the blog comment array
            Blogs.findOneAndUpdate({_id:comment.blog_id},{$pull:{comments:_id}
            ,$inc:{"activity.total_comments":-1},
            "activity.total_parent_comments":comment.parent?0:-1})
            .then(blog=>{
                if(comment.children.length){
                    //Here we will delete the reply of the comment
                    //If the comment that we want to delete has some reply comments then
                    //its necessary to delete those comments too
                    //Hence we use the map function to find all the reply comment from the comment 
                    //children array and then we will delete those comments
                    comment.children.map(replies=>{
                        deleteComments(replies)
                    })
                }
            })

    })
    .catch(error=>{
        console.log(error.message)
    })
}
export const DeleteComments=(req,res,next)=>{
    let user_id=req.user.id
    let{_id}=req.body
    comments.findOne({_id})
    .then(comment=>{
        if(user_id==comment.commented_by||user_id==comment.blog_author){
            deleteComments(_id)
            return res.status(200).json(
                {
                    success:true,
                    message:"Comment deleted successfully"
                }
            )
        }
        else{
            return next(errorhandler(400,error.message))
        }
    })
    .catch(error=>{
        return next(errorhandler(400,error.message))
    })

}