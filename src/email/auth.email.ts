import { sendEmail } from '../utils/email.util.js';

export const sendVerificationEmail = async (email: string, token: string, redirectTo: string) => {
    const appUrl = process.env.APP_URL || 'http://localhost:5000';
    const verifyUrl = `${appUrl}/api/v1/auth/verify?token=${token}&type=signup&redirect_to=${encodeURIComponent(redirectTo)}`;

    await sendEmail({
        to: email,
        subject: 'Verify your account - Frontline Framework',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #f97316;">Welcome to Frontline Framework!</h2>
                <p>Thank you for signing up. Please verify your email address to activate your account and start your free trial.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
                </div>
                <p style="font-size: 14px; color: #64748b;">If the button above doesn't work, copy and paste this link into your browser:</p>
                <p style="font-size: 14px; color: #f97316; word-break: break-all;">${verifyUrl}</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                <p style="font-size: 12px; color: #94a3b8;">This link will expire in 24 hours. If you did not create an account, please ignore this email.</p>
            </div>
        `,
    });
};

export const sendManagerInviteEmail = async (email: string, token: string, password: string) => {
    const appUrl = process.env.APP_URL || 'http://localhost:5000';
    const frontendCallback = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL.replace(/\/$/, '')}/auth/callback` : '';
    const verifyUrl = frontendCallback
        ? `${frontendCallback}?token=${token}&type=invite`
        : `${appUrl}/api/v1/auth/verify?token=${token}&type=invite&redirect_to=${encodeURIComponent(process.env.FRONTEND_URL || '')}`;

    await sendEmail({
        to: email,
        subject: 'You have been invited as a manager',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #0f172a;">You have been invited as a manager</h2>
                <p>Your temporary password is: <strong>${password}</strong></p>
                <p>Please verify your email and set a new password by clicking the button below.</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${verifyUrl}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify and Set Password</a>
                </div>
                <p style="font-size: 12px; color: #94a3b8;">If you did not expect this email, contact your administrator.</p>
            </div>
        `,
    });
};
