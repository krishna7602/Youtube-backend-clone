import express from "express"
import { Router } from "express"
import {
  getAllLikedVideos,
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
} from "../controller/like.controller.js"

const router=Router();


router.use(verifyJWT); 

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getAllLikedVideos);

export default router