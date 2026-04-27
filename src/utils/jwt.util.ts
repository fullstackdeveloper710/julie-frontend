/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import type { StringValue } from "ms";
import { EAuthType } from "../v1/enums/jwt.enum.js";
import { TAccessToken, TAuthTokens, TAuthTokenTypes, TTokenPayload } from "../v1/types/token.type.js";
// Read secrets once and provide helpful errors/warnings
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || "dev_access_secret_change_me";
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || "dev_refresh_secret_change_me";
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    const missing: string[] = [];
    if (!ACCESS_TOKEN_SECRET) missing.push("ACCESS_TOKEN_SECRET");
    if (!REFRESH_TOKEN_SECRET) missing.push("REFRESH_TOKEN_SECRET");
    throw new Error(`Missing JWT secret(s): ${missing.join(", ")}. Set environment variables ${missing.join(", ")} before starting the server.`);
}
/**
 * @description This function is used to generate access token and refresh token at the time of login
 * @param {object} payload will take user_id and role data to encrypt in access_token
 * @returns {TAuthTokens} the encrypted access and refresh token
 */
const ACCESS_TOKEN_EXPIRY: StringValue = (process.env.ACCESS_TOKEN_EXPIRY || "15m") as StringValue;
const REFRESH_TOKEN_EXPIRY: StringValue = (process.env.REFRESH_TOKEN_EXPIRY || "7d") as StringValue;

export const generateAuthTokens = (payload: TTokenPayload): TAuthTokens => {
    // sign with RSA SHA256, Access Token short lived credential
    const access_token: string = Jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        algorithm: 'HS256',
        audience: "public",
        expiresIn: ACCESS_TOKEN_EXPIRY,
        issuer: "staplelogic"
    });
    // sign with RSA SHA256, Refresh Token long lived credential
    const refresh_token: string = Jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        algorithm: 'HS256',
        audience: "public",
        expiresIn: REFRESH_TOKEN_EXPIRY,
        issuer: "staplelogic"
    });
    // Verifying generated tokens to get iat and exp
    const decode_access_token: any = Jwt.verify(access_token, ACCESS_TOKEN_SECRET, { algorithms: ['HS256'] });
    const decode_refresh_token: any = Jwt.verify(refresh_token, REFRESH_TOKEN_SECRET, { algorithms: ['HS256'] });
    const tokens: TAuthTokens = {
        access_token: {
            token_type: EAuthType.bearer,
            token: access_token,
            iat: decode_access_token.iat,
            exp: decode_access_token.exp
        },
        refresh_token: {
            token_type: EAuthType.bearer,
            token: refresh_token,
            iat: decode_refresh_token.iat,
            exp: decode_refresh_token.exp
        }
    };
    return tokens;
}
/**
 * @description Generates only access tokens for the specified user
 * @param {object} payload will take user_id and role data to encrypt in access_token
 * @returns {TAccessToken} the encrypted access
 */
export const generateAccessToken = (payload: TTokenPayload): TAccessToken => {
    // sign with RSA SHA256, Access Token short lived credential
    const access_token: string = Jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        algorithm: 'HS256',
        audience: "public",
        expiresIn: ACCESS_TOKEN_EXPIRY,
        issuer: "staplelogic"
    });
    const decode_access_token: any = Jwt.verify(access_token, ACCESS_TOKEN_SECRET, { algorithms: ['HS256'] });
    const token: TAccessToken = {
        token_type: EAuthType.bearer,
        token: access_token,
        iat: decode_access_token.iat,
        exp: decode_access_token.exp
    };
    return token;
}
/**
 * @param {string} token Jwt token to decode
 * @param {string} token_type Token type to decode
 * @returns {JwtPayload | string} jwt decoded token data
 */
export const verify = (token: string, token_type: TAuthTokenTypes = "access_token"): string | JwtPayload => {
    // verifies token
    const secretToUse = token_type === "access_token" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
    const decode_token: JwtPayload | string = Jwt.verify(token, secretToUse, { algorithms: ['HS256'] });
    return decode_token;
}