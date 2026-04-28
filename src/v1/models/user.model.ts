import { Schema, model } from 'mongoose';
import { TUser } from '../types/user.type';
import { EUserPlan, EUserRole } from '../enums/agency.enum';

const UserSchema = new Schema<TUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        fullName: {
            type: String,
            trim: true,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        agencies: [
            {
                type: Schema.Types.ObjectId,//maximum  two agency if user have enterprise plan
                ref: "agencies"
            }
        ],
        role: {
            type: String,
            enum: Object.values(EUserRole),
            default: EUserRole.USER,
        },
        title: {
            type: String,
            trim: true,
            maxlength: 200,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        plan: {
            type: String,
            enum: Object.values(EUserPlan),
            required: true
        },
        isConfirmed: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
        },
        verificationExpires: {
            type: Date,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        collection: 'users',

    }
);

const User = model<TUser>('User', UserSchema);
export default User;