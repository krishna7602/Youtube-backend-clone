import {Subscription} from "../models/subscription.models.js"
import mongoose from "mongoose"

const toogleSubsscription=async(req,res)=>{
    try {
        const {channelId}=req.body;
        const userId=req.user?._id;
        if(!channelId){
            throw new Error("channel is not defined")
        }
        if(!userId){
            throw new Error("unauthorized userr")
        }
        if(channelId.toString()===userId.toString()){
            throw new Error("you can't subscribe to yourself")
        }
    
        const existingSubscriber=await Subscription.findOne({
            subscriber:userId,
            channel:channelId,
        })
    
        if(existingSubscriber){
            await Subscription.findOneAndDelete(existingSubscriber._id)
            throw new Error("unsubscribed")
        }
        else{
            const newSubscription=await Subscription.create({
                subscriber:userId,
                channel:channelId,
            })
            return res.status(201).json({
                message: "Subscribed successfully",
                subscription: newSubscription,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getSubscribedChannels=async(req,res)=>{
    try {
        const {channelId}=req.params;
        const userId=req.user?._id;
        if(!channelId){
            throw new Error("channel is invalid")
        }
        if(!userId){
            throw new Error("unauthorized user")
        }
    
        const getSubscribers=await Subscription.find({subscriber:userId}).populate('channel')
    
        const channels = getSubscribers.map((sub) => sub.channel);
    
        return res.status(200).json({
          message: "Subscribed channels fetched successfully",
          channels,
        });
    } catch (error) {
        console.error("Error fetching subscribed channels:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


const getUserChannelSubscribers=async(req,res)=>{
    try {
        const {channelId}=req.params
        if(!channelId){
            throw new Error("channel is required")
        }
        const userId=req.user?._id
        if(userId){
            throw new Error("unauthorized user")
        }
        const subscriptions = await Subscription.find({ channel: channelId }).populate("subscriber");
    
        const subscribers = subscriptions.map((sub) => sub.subscriber);
    
        return res.status(200).json({
          message: "Subscribers fetched successfully",
          subscribers,
        })
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export {toogleSubsscription,getSubscribedChannels,getUserChannelSubscribers }