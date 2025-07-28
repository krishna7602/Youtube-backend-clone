import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js"


export const verifyJwt=async(req,res,next)=>{
    try {
        const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token is missing" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user=await User.findById(decoded?._id).select("-password -refreshToken")

    if(!user){
        throw new Error("unauthorized access")
    }

    req.user=user
    next()


    } catch (error) {
        console.log(error)
        throw new Error("unauthorized access from catch block")
    }
}