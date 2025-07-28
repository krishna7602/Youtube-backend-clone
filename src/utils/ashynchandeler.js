const asyncHandler=(requestHamdler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHamdler(req,res,next)).catch((err)=> next(err))
    }
}


export {asyncHandler}