import { Request, Response } from 'express';
import MESSAGES from "@/constant/message";
import RESPONSE_CODES from "@/constant/responseCode";
import IError from "@/v1/interfaces/error.interface";
import ISuccess from "@/v1/interfaces/success.interface";
// return success(req, res, data, RESPONSE_CODES, MESSAGES);
export const success = (req: Request, res: Response, data: object | null, statusCode: number, message: string) => {
    if (!statusCode) {
        statusCode = RESPONSE_CODES.OK;
    }
    let res_obj: ISuccess = {
        success: true,
        statusCode: statusCode,
        message: message || MESSAGES.COMMON.SUCCESS,
        data: data || {}
    }

    return res.status(statusCode).json(res_obj);
}

export const failed = (req: Request, res: Response, statusCode: number, message: string) => {
    if (!statusCode) {
        statusCode = RESPONSE_CODES.BAD_REQUEST;
    }

    let res_obj: IError = {
        success: false,
        statusCode: statusCode,
        message: message || MESSAGES.COMMON.SUCCESS,
        error: {
            statusCode: statusCode,
            message: message,
        }
    }

    return res.status(statusCode).json(res_obj);
}