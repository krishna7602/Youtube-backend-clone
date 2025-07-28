import { registerUser, logInUser, logOutUser } from "../controller/user.controller.js";
import { Router } from "express";
import {verifyJwt} from '../middlewares/auth.middlewares.js'

import {upload} from "../middlewares/multer.middlewares.js"

const router=Router();


router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").get(logInUser)

router.route("/logout").post(verifyJwt,logOutUser)


export default router