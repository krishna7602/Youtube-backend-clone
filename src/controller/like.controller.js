import {likes} from "../models/likes.models.js"
import {User} from "../models/user.models.js"


const getAllLikedVideos=async(req , res)=>{
    try {
        const userId=req?._id
        if(!userId){
            throw new Error("unauthorized access")
        }
        const likedVideoLikes = await likes.find({
            likedBy: userId,
            video: { $ne: null }
        }).populate("video");
    
        const likedVideos = likedVideoLikes.map(like => like.video);
    
        return res.status(200).json(new apiResponse(200, likedVideos, "Liked videos fetched successfully")); 
    } catch (error) {
        console.log(error)
        throw new Error("found some error in finding liked videos")
    }
}


const toogleVideoLike=async(req,res)=>{
    try {
        const userId=req.user?._id
        if(!userId){
            throw new Error("unauthorized access")
        }
    
        const {videoId}=req.params
        if(!videoId){
            throw new Error("video not found")
        }
    
        const existingLike=await likes.findOne({
            likedBy:userId,
            video:videoId
        })
    
        if(existingLike){
            likes.findByIdAndDelete(existingLike?._id)
            return res.status(200).json(new apiResponse(200, null, "Video unliked"));
        }
        else{
            await likes.create({
                likedBy:userId,
                video:videoId
            })
            return res.status(200).json(new apiResponse(200, null, "Video liked"));
        }
    } catch (error) {
        console.log(error)
        throw new Error("something is wrong in like or unlike the video")
    }
}


const toogleCommentLike=async(req , res)=>{
   try {
     const userId=req.user?._id
     if(!userId){
         throw new Error("unauthorized access")
        }
 
     const {commentId}=req.params
     if(!commentId){
         throw new Error("invalid comment")
        }
 
     const existingComment=await likes.findOne({
         likedBy:userId,
         comment:commentId,
        })
 
     if(existingComment){
         await existingComment.findByIdAndDelete(existingComment._id);
         return res.status(200).json({ success: true, message: "Comment unliked" });
        }
     else{
         await likes.create({
             likedBy:userId,
             comment:commentId
         })
         return res.status(200).json({ success: true, message: "Comment liked" });
        }
     } catch (error) {
        console.error("Error in toggleCommentLike:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}



export {
    getAllLikedVideos,
    toogleVideoLike,
    toogleCommentLike
}


