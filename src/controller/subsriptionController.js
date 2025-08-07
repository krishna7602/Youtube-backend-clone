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



export {toogleSubsscription}