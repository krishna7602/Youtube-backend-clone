class apiResponse {
    constructor(statusCode,response,message,success){
        this.statusCode=statusCode
        this.response=response
        this.message=message
        this.success=statusCode<400
    }
}

export {apiResponse}