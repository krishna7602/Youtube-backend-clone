import mongoose from "mongoose";
import {Video} from "../models/videos.models.js"
import { error } from "console";
import { uploadInCloudinary } from "../utils/cloudinary.js";




const publishVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      throw new Error("title and description are required");
    }

    const userId = req.user?._id;
    if (!userId) {
      throw new Error("unauthorized user");
    }

  
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
      throw new Error("video file is required");
    }
    if (!thumbnailLocalPath) {
      throw new Error("thumbnail is required");
    }

  
    const videoUpload = await uploadInCloudinary(videoLocalPath);
    const thumbnailUpload = await uploadInCloudinary(thumbnailLocalPath);

    if (!videoUpload?.url) {
      throw new Error("Failed to upload video");
    }
    if (!thumbnailUpload?.url) {
      throw new Error("Failed to upload thumbnail");
    }

    
    const videoDoc = await Video.create({
      videoFile: videoUpload.url,
      thumbnail: thumbnailUpload.url,
      title,
      description,
      views: 0,
      duration: videoUpload.duration || 0,
      isPublished: true,
      owner: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Video published successfully",
      data: videoDoc,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};





const getVideoId=async(req,res)=>{
    try {
        const {videoId}=req.params;
        const userId=req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized user" });
        }
    
        if (!videoId) {
            return res.status(400).json({ error: "videoId is required" });
        }
        
        const video=await Video.findOne({
            videofile:videoId,    
        })
    
        if(!video){
            throw new Error("video can't found")
        }
        return res.status(200).json(video)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
}


const deleteVideo=async(req,res)=>{
   try {
     const {videoId}=req.params
     const userId=req.user?._id
 
     if(!userId){
        return res.status(401).json({ error: "Unauthorized user" });    
     }
 
     if(!videoId){
        return res.status(402).json({error:"error in video file!! try again"})
     }
 
     const deletedVideo=await Video.findByIdAndDelete(
        videoId
     )

     if(!deletedVideo){
        throw new Error("video can't found")
     }
 
     return res.status(200).json({
        message:"video succesfully deleted"
     })
   } catch (error) {
    console.log(error)
        return res.status(500).json({ error: error.message });
   }
}


const updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    if (!videoId) {
      return res.status(400).json({ error: "Video ID is required" });
    }

    const { thumbnail, title, description } = req.body;

    if (!thumbnail || !title || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

   
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (video.owner.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not allowed to update this video" });
    }


    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { thumbnail, title, description },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Video successfully updated",
      video: updatedVideo,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


const togglePublishStatus=async(req,res)=>{
   try {
     const userId=req.user?._id
     const {videoId}=req.params
 
     if(!userId){
         throw new Error("unauthorized user")
     }
 
     if(!videoId){
         throw new Error("video file is required");
     }
 
     const video=await Video.findById(videoId);
     if(!video){
         throw new Error("video can't found")
     }
     if(video.owner.toString()!==userId.toString()){
         throw new Error("you cant change the file publication status")
     }
 
     video.isPublished = !video.isPublished;
     await video.save();
 
      return res.status(200).json({
       message: `Video is now ${video.isPublished ? "published" : "unpublished"}`,
       video,
     });
   } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
   }
}



export {getVideoId, deleteVideo, updateVideo,togglePublishStatus,publishVideo}