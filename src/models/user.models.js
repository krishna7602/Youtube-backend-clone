import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema=new Schema(
    {
        username:{
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            index:true,
            trim: true,
        },
        email:{
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        fullName:{
            type: String,
            required: true,
            index:true,
            trim: true,
        },
        avatar:{
            type: String,
            required: true
        },
        coverImage:{
            type: String
        },
        watchHistory:[{
            type:Schema.Types.ObjectId,
            ref:"Video"
        }],
        password:{
            type: String,
            required: [true, "password is requird"]
        },
        refreshToken:{
            type: String
        }
    },{timestamps: true}
)


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10);
    next()
})

userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIERY}
);
}


userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIERY}
);
}

export const User=mongoose.model("User",userSchema)