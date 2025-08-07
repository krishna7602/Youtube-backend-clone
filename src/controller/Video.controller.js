import mongoose from "mongoose";
import {Video} from "../models/videos.models.js"



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


export {getVideoId}