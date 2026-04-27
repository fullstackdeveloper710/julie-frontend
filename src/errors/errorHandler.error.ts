import { NextFunction, Request, Response } from "express";
import RESPONSE_CODES from "../constant/responseCode.js";
import MESSAGES from "../constant/message.js";
import { CustomError } from "./custom.error.js";

export const errorHandler = (err: Error | CustomError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err)
    }
    let statusCode = RESPONSE_CODES.BAD_REQUEST;
    let message = err.message || MESSAGES.COMMON.ERROR;

    if (["jwt expired", "Authentication error", "jwt malformed", "invalid signature"].includes(message)) {
        statusCode = RESPONSE_CODES.UNAUTHORIZED
    }

    if (err instanceof CustomError) {
        statusCode = err._statusCode;
        message = err._message;
    }

    let res_obj = {
        success: false,
        statusCode: statusCode,
        message: message,
        error: {
            statusCode: statusCode,
            message: message,
        }
    }

    return res.status(statusCode).json(res_obj);

};

export default errorHandler;