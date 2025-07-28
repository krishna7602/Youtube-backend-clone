import {v2 as cloudinary} from "cloudinary"
import fs from "fs";
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
cloud_name: 'dsxhfoqt4',
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET
});



// dsxhfoqt4

const uploadInCloudinary=async(localfilepath)=>{
    console.log(localfilepath)
    try {
        if(!localfilepath) return NULL;
        const response=await cloudinary.uploader.upload(
            localfilepath,
            {resource_type:"auto"}
        )
        console.log(`file uploaded succesfully ${response.url}`)
        fs.unlinkSync(localfilepath)
        return response;
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localfilepath);
        return null
    }
}


export {uploadInCloudinary}