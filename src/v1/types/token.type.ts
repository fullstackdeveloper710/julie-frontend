import { Types, ObjectId } from "mongoose";
import { EAuthType } from "../enums/jwt.enum.js";

export type TAuthTokenTypes = "access_token" | "refresh_token";

export type TAccessToken = {
    token_type: EAuthType,
    token: string,
    iat: Date | number | string,
    exp: Date | number | string,
}

export type TRefreshToken = {
    token_type: EAuthType,
    token: string,
    iat: Date | number | string,
    exp: Date | number | string,
}

export type TAuthTokens = {
    access_token: TAccessToken,
    refresh_token: TRefreshToken,
}

export type TTokenPayload = {
    user_id: string | Types.ObjectId | ObjectId,
};