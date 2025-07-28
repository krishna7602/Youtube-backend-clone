import { Like } from "../models/likes.models.js";

import mongoose from "mongoose";

//  1. Get all liked videos
const getAllLikedVideos = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const likedVideoLikes = await Like.find({
      likedBy: userId,
      video: { $ne: null },
    }).populate("video");

    const likedVideos = likedVideoLikes.map((like) => like.video);

    return res.status(200).json({
      success: true,
      message: "Liked videos fetched successfully",
      data: likedVideos,
    });
  } catch (error) {
    console.error("Error in getAllLikedVideos:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch liked videos" });
  }
};

//  2. Toggle video like
const toggleVideoLike = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { videoId } = req.params;
    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ success: false, message: "Invalid video ID" });
    }

    const existingLike = await Like.findOne({ likedBy: userId, video: videoId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json({ success: true, message: "Video unliked" });
    } else {
      await Like.create({ likedBy: userId, video: videoId });
      return res.status(200).json({ success: true, message: "Video liked" });
    }
  } catch (error) {
    console.error("Error in toggleVideoLike:", error);
    return res.status(500).json({ success: false, message: "Error while liking/unliking video" });
  }
};

//  3. Toggle comment like
const toggleCommentLike = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { commentId } = req.params;
    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ success: false, message: "Invalid comment ID" });
    }

    const existingLike = await Like.findOne({ likedBy: userId, comment: commentId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json({ success: true, message: "Comment unliked" });
    } else {
      await Like.create({ likedBy: userId, comment: commentId });
      return res.status(200).json({ success: true, message: "Comment liked" });
    }
  } catch (error) {
    console.error("Error in toggleCommentLike:", error);
    return res.status(500).json({ success: false, message: "Error while liking/unliking comment" });
  }
};

//  4. Toggle tweet like
const toggleTweetLike = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    const { tweetId } = req.params;
    if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
      return res.status(400).json({ success: false, message: "Invalid tweet ID" });
    }

    const existingLike = await Like.findOne({ likedBy: userId, tweet: tweetId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json({ success: true, message: "Tweet unliked" });
    } else {
      await Like.create({ likedBy: userId, tweet: tweetId });
      return res.status(200).json({ success: true, message: "Tweet liked" });
    }
  } catch (error) {
    console.error("Error in toggleTweetLike:", error);
    return res.status(500).json({ success: false, message: "Error while liking/unliking tweet" });
  }
};

export {
  getAllLikedVideos,
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
};
