import Validate from "../../utils/validate.util";
import Services from '../services/index'
import Validation from "../validations/index";
import { handleErrorResponse } from "../../utils/error.util";
import { Request, Response } from "express";
import { NextFunction } from "express";
import RESPONSE_CODES from "@/constant/responseCode";
import { AuthenticatedRequest } from "@/middlewares/authenticate";
import MESSAGES from "@/constant/message";


/**
 * @route POST /api/v1/auth/signup
 */
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Validate(req.body, Validation.user.signUpValidation)
        const result = await Services.auth.signUp(req.body);
        return res.status(RESPONSE_CODES.CREATED).json({
            success: true,
            message: result.message,
            data: result.user,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route GET /api/v1/auth/verify
 * @desc Verify via link click
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token, redirect_to } = req.query;
        if (!token) {
            return res.status(RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Token is required',
            });
        }

        const redirectUrl = await Services.auth.verifyEmail(
            token as string,
            (redirect_to as string) || process.env.FRONTEND_URL || 'http://localhost:3000/auth/callback'
        );

        // Redirect to frontend with tokens
        return res.redirect(redirectUrl);
    } catch (error: any) {
        // If it's a verification error, we might want to redirect to an error page on frontend
        const errorRedirect = `${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(error.message || 'Verification failed')}`;
        return res.redirect(errorRedirect);
    }
};

/**
 * @route POST /api/v1/auth/signin
 */
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Validate(req.body, Validation.user.signInValidation);
        const result = await Services.auth.signIn(req.body);
        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: MESSAGES.AUTH.LOGGED_IN,
            data: result,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route GET /api/v1/auth/me
 */
export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
                data: null,
            });
        }

        Validate(req.user, Validation.user.getMeValidation);

        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.UNAUTHORIZED,
                data: null,
            });
        }
        const user = await Services.auth.getProfile(userId);
        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: MESSAGES.USER.FETCHED,
            data: user,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};
