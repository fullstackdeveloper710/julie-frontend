import crypto from 'crypto';

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a secure random token
 */
export const generateToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};
