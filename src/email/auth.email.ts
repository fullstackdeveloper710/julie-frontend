import { sendEmail } from "../utils/email.util.js";

export const sendVerificationEmail = async (
  email: string,
  token: string,
  redirectTo: string,
) => {
  // Email link points at the frontend /verify page, which calls the backend
  // /api/v1/auth/verify endpoint and auto-logs the user in on success.
  const frontendUrl = (
    redirectTo ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
  const verifyUrl = `${frontendUrl}/verify?token=${token}&type=signup`;

  await sendEmail({
    to: email,
    subject: "Verify your account - Frontline Framework",
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

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const frontendUrl = (
    process.env.FRONTEND_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  const resetUrl = `${frontendUrl}/auth/update-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset your password - Frontline Framework",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #f97316;">Reset Your Password</h2>
            <p>We received a request to reset your password. Click the button below to set a new password.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Reset Password
                </a>
            </div>
            <p style="font-size: 14px; color: #64748b;">
                If the button above doesn't work, copy and paste this link into your browser:
            </p>
            <p style="font-size: 14px; color: #f97316; word-break: break-all;">
                ${resetUrl}
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="font-size: 12px; color: #94a3b8;">
                This link will expire in 1 hour. If you did not request this, you can safely ignore this email.
            </p>
        </div>
    `,
  });
};

export const sendManagerInviteEmail = async (
  email: string,
  token: string,
  password: string,
) => {
  const frontendUrl = (
    process.env.FRONTEND_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  const verifyUrl = `${frontendUrl}/verify?token=${token}&type=invite`;

  await sendEmail({
    to: email,
    subject: "You have been invited as a manager",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #f97316;">You're Invited!</h2>
            <p>You have been invited to join Frontline Framework as a manager.</p>
            <p>Your temporary password is:</p>
            <p style="font-size: 16px; font-weight: bold; color: #f97316;">${password}</p>
            <p>Please verify your email and set a new password to get started.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Verify & Set Password
                </a>
            </div>
            <p style="font-size: 14px; color: #64748b;">
                If the button above doesn't work, copy and paste this link into your browser:
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="font-size: 12px; color: #94a3b8;">
                If you did not expect this invitation, please contact your administrator.
            </p>
        </div>
    `,
  });
};
