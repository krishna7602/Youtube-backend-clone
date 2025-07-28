import {User} from "../models/user.models.js"
import {uploadInCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const registerUser = async (req, res) => {
    try {
        // Extract user data from request body
        const { username, email, fullName, password } = req.body;

        if([username,email,fullName,password].some((field)=>field?.trim()==="")) throw new Error("All fields are required!")
        const existedUser=await User.findOne({
            $or:[{username},{email}]
        })

        if(existedUser) throw new Error("user allready exists")
        console.warn(req.files)
        const avatarLocalPath = req.files?.avatar?.[0]?.path
        const coverLocalPath = req.files?.coverImage?.[0]?.path
        
        if(!avatarLocalPath) throw new Error("avatar is required")

        const avatar=await uploadInCloudinary(avatarLocalPath);
        const coverImage=await uploadInCloudinary(coverLocalPath)

        const user=await User.create({
            username,
            email,
            password,
            avatar:avatar.url,
            coverImage:coverImage.url,
            fullName
        })

        const createdUser=User.findById(user._id).select("-password")
        if(!createdUser) throw new Error("something is wrong")

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message);
    }
};

const genrateAcessRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId)
        if(!user) {
            throw new Error("User not found");
        }
        const accessToken=await user.generateAccessToken();
        const refreshToken=await user.generateRefreshToken()
    
        User.refreshToken=refreshToken
        await user.save({valiadateBeforeSave:false})
    
        return {accessToken,refreshToken}
    } catch (error) {
        console.log(error)
        throw new error("error in genrating acces and refresh token")
    }
}

const logInUser=async(req,res)=>{
    try {
        const {email, username,password}=req.body
        if(!email && !username) throw new Error("email or username is required")
        const user=await User.findOne({
            $or:[{username},{email}]
        })

        if(!user){
            throw new Error("user not found in log in")
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if(!isPasswordValid){
            throw new Error("password is incorrect")
        }
        const {accessToken,refreshToken}= await genrateAcessRefreshToken(user._id)

        const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

        if(!loggedInUser){
            throw new Error("Something went wrong during login");
        }

        const options={
            httpOnly: true,
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
            message: "Login successful",
            user: loggedInUser,
            accessToken,
            refreshToken
            });
    } catch (error) {
        console.log(error)
        throw new Error("An error occurred during login. Please try again later.")
    }
}


const refreshAccessToken=async(req,res)=>{
    try {
        const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
        if(!incomingRefreshToken){
            throw new Error("Refresh token is required")
        }
        try {
            const decodeToken=jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET,
            )
            const user=await User.findById(decodeToken?._id)
            if(!user){
                throw new Error("invalid refresh token")
            }

            if(incomingRefreshToken!==user?.refreshToken){
                throw new Error("Refresh token does not match the stored token")
            }

            const options={
                httpOnly:true
            }

            

            const {accessToken,refreshToken}=await genrateAcessRefreshToken(user._id)

            user.refreshToken = refreshToken;
            await user.save();
            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json({
                    message: "Access token refreshed successfully",
                    accessToken,
                    refreshToken
                });
        } catch (error) {
            console.log(error)
            throw new Error("something is wrong")
        }

    } catch (error) {
        console.log(error)
        throw new Error("An error occurred while refreshing the access token.")
    }
}


const logOutUser=async(req,res)=>{
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    refreshToken:undefined
                }
            },
            {new:true}
        )
    
        const option={
            httpOnly:true
        }
    
        return res
          .clearCookie("accessToken", options)
          .clearCookie("refreshToken", options)
          .status(200)
          .json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ error: "Something went wrong during logout" });
    }
}


const changePassword=async(req,res)=>{
    try {
        const {oldpassword , newpassword}=req.body;
        const user=await User.findById(req.user._id);
        if(!user){
            console.log("some error happend");
            throw new Error("user is not found")
        }
        const isPasswordValid = await user.isPasswordCorrect(oldpassword);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Old password is incorrect" });
        }
        user.password=newpassword
        await user.save({validateBeforeSave: false})
        return res.status(200).json({ message: "Password changed successfully" });  
    } catch (error) {
        console.error("Change password error:", error.message);
        return res.status(500).json({ error: "Something went wrong while changing password" });
    }
}


const changeEmail=async(req,res)=>{
    try {
        const {email,password,newemail}=req.body;
        if(!email) throw new Error("old email is required");
        if(!password) throw new Error("password is required");
        if(!newemail) throw new Error("new email is required");

        const user=await User.findById(req.user?._id);

        if(!user){
            throw new Error("user not found")
        }
        const isPasswordValid=await user.isPasswordCorrect(password);
        if(!isPasswordValid){
            throw new Error("password is incorrect")
        }
        user.email=newemail
        await user.save({validateBeforeSave:false})
        return res.status(200).json({ message: "email changed succesfully!!"});  
    } catch (error) {
        console.error("Error in changeEmail:", error.message);
        return res.status(500).json({ error: "Something went wrong while changing email" });
    }
}

const getUserChannelProfile=async(req,res)=>{
    const {username}=req.params
    if(!username){
        throw new Error("username not found")
    }
    const channel=await User.aggregate(
        [
            {
                $match:{
                    username:username?.toLowerCase()
                }
            }
        ]
    )
}


export {
    registerUser,
    logInUser,
    refreshAccessToken,
    logOutUser,
    changeEmail,
    changePassword,
    getUserChannelProfile
}