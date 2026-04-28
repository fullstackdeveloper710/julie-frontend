import { EAgencyType, EUserPlan, EUserRole, EUserStatus } from "../enums/agency.enum.js";



export type TAuthBase = {
    email: string;
    password: string;
};

export type TSignUpInput = TAuthBase & {
    fullName: string;
    role?: EUserRole;
    plan: EUserPlan;
};

export type TUserAccount = TSignUpInput & {
    isConfirmed: boolean;
    verificationToken: string | undefined;
    verificationExpires: Date | undefined;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Date | undefined;
};

export type TUser = TUserAccount & {
    agencies: string[]; // Array of agency IDs
    isDeleted: boolean;
    title?: string;
    createdBy?: string;
    status?: EUserStatus;
    createdAt: string;
    updatedAt: string;
}
