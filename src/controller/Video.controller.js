import mongoose from "mongoose";
import {Video} from "../models/videos.models.js"
import { error } from "console";



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



export {getVideoId, deleteVideo, updateVideo}