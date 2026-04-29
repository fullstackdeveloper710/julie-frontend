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
 * @route GET /api/v1/auth/verify?token=...
 * @desc Verify the email token and return the user + JWT tokens as JSON so
 *       the frontend can auto-log the user in.
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.query;
        if (!token || typeof token !== 'string') {
            return res.status(RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'Token is required',
                data: null,
            });
        }

        const result = await Services.auth.verifyEmail(token);

        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: MESSAGES.AUTH.EMAIL_VERIFIED,
            data: result,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route POST /api/v1/auth/forgot-password
 * @desc Send a password reset link via email
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Validate(req.body, Validation.user.forgotPasswordValidation);
        const result = await Services.auth.forgotPassword(req.body.email);
        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: result.message,
            data: null,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route POST /api/v1/auth/reset-password
 * @desc Set a new password using a reset token
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Validate(req.body, Validation.user.resetPasswordValidation);
        const result = await Services.auth.resetPassword(req.body.token, req.body.password);
        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: result.message,
            data: null,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
    }
};

/**
 * @route POST /api/v1/auth/signout
 * @desc Stateless JWT signout (client discards tokens; endpoint exists for parity).
 */
export const signOut = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: MESSAGES.AUTH.LOGGED_OUT,
            data: null,
        });
    } catch (error) {
        handleErrorResponse(error, res, next);
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
 * @route POST /api/v1/auth/refresh
 * @desc Exchange a refresh token for a new access token (silent renewal).
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refresh_token } = req.body ?? {};
        if (!refresh_token || typeof refresh_token !== 'string') {
            return res.status(RESPONSE_CODES.BAD_REQUEST).json({
                success: false,
                message: 'refresh_token is required',
                data: null,
            });
        }
        const result = await Services.auth.refreshAccessToken(refresh_token);
        return res.status(RESPONSE_CODES.OK).json({
            success: true,
            message: MESSAGES.AUTH.ACCESS_TOKEN_GENERATED,
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
