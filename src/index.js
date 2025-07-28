import { app } from "./app.js";
import 'dotenv/config'
import connectDB from "./db/index.js";
import { error } from "console";



const PORT = process.env.PORT || 3000;

connectDB().
then(()=>{
    app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    })
}).catch((err)=>{
    console.log(err);
})
    

