import { Request, Response, NextFunction } from "express";
import { verify } from "../utils/jwt.util.js";
import MESSAGES from "../constant/message.js";
import RESPONSE_CODES from "../constant/responseCode.js";
import User from "../v1/models/user.model.js";

export interface AuthenticatedRequest extends Request {
    user?: {
        user_id: string;
    };
}

const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.TOKEN_NOT_PROVIDED,
                data: null,
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.TOKEN_NOT_PROVIDED,
                data: null,
            });
        }

        const decoded = verify(token) as { user_id: string };
        const user = await User.findById(decoded.user_id);

        if (!user || user.isDeleted) {
            return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTH.PROFILE_NOT_FOUND,
                data: null,
            });
        }

        req.user = {
            user_id: user._id.toString(),
        };

        return next();
    } catch (error) {
        return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
            success: false,
            message: "Invalid or expired token",
            data: null,
        });
    }
};

export default authenticate;
