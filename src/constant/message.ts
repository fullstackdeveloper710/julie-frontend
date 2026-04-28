const MESSAGES = {
    COMMON: {
        SUCCESS: "success",
        ERROR: "error",
        INTERNAL_SERVER_ERROR: "Internal server error",
        NOT_FOUND: "Not found",
        BAD_REQUEST: "bad request",
        ID_REQUIRED: "id required",
        FILE_NOT_FOUND: "File not found",
        INVALID_PARAMS: "Invalid params",
    },
    AUTH: {
        EMAIL_ALREADY_EXISTS: "Email already exists",
        EMAIL_NOT_FOUND: "Email not found",
        EMAIL_REQUIRED: "Email is required",
        REGISTERED_SUCCESSFULLY: "Registration successful",
        EMAIL_VERIFIED: "Email verified",
        LINK_EXPIRED: "Link expired",
        FORGOT_PASSWORD: "OTP sent on email to reset password",
        ACCOUNT_NOT_FOUND: "Account not found. Please contact your administrator",
        ACCOUNT_BLOCKED: "Your account is blocked",
        PASSWORD_CHANGED_RECENTLY: "Password can be change once in 24 Hours",
        INVALID_OTP: "Invalid OTP",
        OTP_EXPIRED: "Otp is expired",
        PASSWORD_RESET_SUCCESSFULLY: "Password reset successfully",
        UNVERIFIED_ACCOUNT: "Your account is unverified. Open your email and verify your account",
        OTP_RESENT: "OTP sent successfully. Please Check your email",
        INVALID_CREDENTIALS: "Invalid credentials",
        LOGGED_IN: "Logged in successfully",
        UNAUTHORIZED: "Unauthorized",
        SIGNATURE_MALFORMED: "Signature malformed",
        LOGGED_OUT: "Logout successfully",
        SESSION_EXPIRED: "Session expired. Login again",
        ACCESS_TOKEN_GENERATED: "New access token generated from the server",
        TOKEN_NOT_PROVIDED: "No token provided",
        PROFILE_NOT_FOUND: "Profile not found",
        INVALID_LINK: "Invalid link or session expired",
        NOT_ENOUGH_PERMISSIONS:
            "You don't have enough permissions to access this resource",
        INVALID_PROVIDER: "Invalid provider",
        INVALID_ROLE: "Invalid role",
        OLD_PASSWORD_NOT_MATCHED: "Password not matched",
        PASSWORD_CHANGED_SUCCESSFULLY: "Password changed successfully",
        PASSWORD_MISMATCH: "New password and confirm password do not match",
        NEW_PASSWORD_SAME_AS_OLD:
            "New password must be different from old password",
        EMAIL_CHECK: "Email existence checked"
    },
    USER: {
        ADDED: "User added successfully",
        FETCHED: "Users fetched successfully",
        EMAIL_ALREADY_EXISTS: "Email Already Exists",
        UPDATED: "User updated successfully",
        DELETED: "User deleted successfully",
        PASSWORD_RESEND: "Password updated and sent successfully to user",
        NOT_FOUND: "User not found",
        GOOGLE_USER_CREATION_FAILED: "Unable to create Google user",
    },
    AGENCY: {
        CREATED: "Agency created successfully",
        UPDATED: "Agency updated successfully",
        FETCHED: "Agency fetched successfully",
        NOT_FOUND: "Agency not found",
        LIMIT_REACHED: (maxAllowed: number) => `You can create up to ${maxAllowed} ${maxAllowed === 1 ? 'agency' : 'agencies'} on your current plan`,
    },
    MANAGER: {
        CREATED: "Admin created and invite sent",
        FETCHED: "Admins fetched successfully",
        UPDATED: "Admin updated successfully",
        DELETED: "Admin deleted successfully",
        NOT_FOUND: "Admin not found",
        ACCOUNT_DISABLED: "Your account is disabled. Please contact the administrator.",
        LIMIT_REACHED: (maxAllowed: number) =>
            `You can create up to ${maxAllowed} admin ${maxAllowed === 1 ? 'seat' : 'seats'} per account`,
    },
    PRICING: {
        FETCHED: "Pricing fetched successfully",
    },
    REPORT: {
        CREATED: "Report created successfully",
        UPDATED: "Report updated successfully",
        DELETED: "Report deleted successfully",
        FETCHED: "Reports fetched successfully",
        NOT_FOUND: "Report not found",
    },
    ANALYTICS: {
        ADDED: "Analytics data added successfully",
        FETCHED: "Analytics data fetched successfully",
    },
    CHECKIN: {
        CREATED: "Monthly check-in submitted successfully",
        UPDATED: "Monthly check-in updated successfully",
        FETCHED: "Monthly check-ins fetched successfully",
        NOT_FOUND: "Monthly check-in not found",
        ALREADY_EXISTS: "A check-in for this month already exists",
    },
    ANNUAL_CHECKIN: {
        CREATED: "Annual check-in submitted successfully",
        UPDATED: "Annual check-in updated successfully",
        FETCHED: "Annual check-ins fetched successfully",
        NOT_FOUND: "Annual check-in not found",
        ALREADY_EXISTS: "An annual check-in for this baseline year already exists",
    },
    TEXT: {
        VERFICATION_SEND: "A verification link has been sent to your email. Please check your inbox."
    }
};

export default MESSAGES;
