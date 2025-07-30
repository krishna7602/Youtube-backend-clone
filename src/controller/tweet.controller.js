import { Tweet } from "../models/tweet.models.js";
import mongoose from "mongoose";

const addTweet = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    const { content } = req.body;
    if (!content || content.trim() === "") {
      return res.status(400).json({ success: false, message: "Tweet content is missing" });
    }

    const newTweet = await Tweet.create({
      content,
      owner: userId,
    });


    await Tweet.save();

    return res.status(201).json({
      success: true,
      message: "Tweet added successfully",
      data: newTweet,
    });
  } catch (error) {
    console.error("Error adding tweet:", error);
    return res.status(500).json({ success: false, message: "Problem in adding tweet" });
  }
};

export { addTweet };
