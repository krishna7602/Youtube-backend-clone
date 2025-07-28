import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/ashynchandeler.js";

const healthcheck = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new apiResponse(200, "ok", "everything is going good"));
});

export { healthcheck };
