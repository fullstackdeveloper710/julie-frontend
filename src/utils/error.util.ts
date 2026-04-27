
import { Response } from "express";
import { CustomError } from "../errors/custom.error.js";

/**
 * Handles error responses in controllers.
 * If the error is an instance of CustomError, it sends a formatted JSON response.
 * Otherwise, it calls the next middleware.
 * 
 * @param error The error object
 * @param res The express response object
 * @param next The express next function
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const handleErrorResponse = (error: unknown, res: Response, next: Function) => {
    if (error instanceof CustomError) {
        return res.status(error.code).json({
            success: false,
            message: error.message,
            data: null
        });
    }
    next(error);
};
