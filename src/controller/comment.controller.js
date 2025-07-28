import mongoose from "mongoose";
import { Comment } from "../models/coments.models.js";



const addComment = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User is not authenticated" });
    }

    const { videoId } = req.params;
    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing video ID" });
    }

    const { comment } = req.body;
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ success: false, message: "Comment cannot be empty" });
    }

    const newComment = await Comment.create({
      content: comment,
      video: videoId,
      owner: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ success: false, message: "Problem in adding comment" });
  }
};

export{
    addComment
}