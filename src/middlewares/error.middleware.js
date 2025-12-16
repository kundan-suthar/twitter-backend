import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // If error is not an instance of ApiError
    if (!(err instanceof ApiError)) {
        statusCode = 500;
        message = "Internal Server Error";
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
    });
};

export { errorHandler };
