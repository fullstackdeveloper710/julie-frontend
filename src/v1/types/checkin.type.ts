import { Types } from "mongoose";

export type TCheckinInput = {
    checkinMonth: Date;
    staffingLevel: number;
    openPositions: number;
    newHires: number;
    overtimeHours: number;
    avgOvertimePerEmployee: number;
    fmlaHours: number;
    totalLeaveHours: number;
    separations: number;
    turnoverRate: number;
    morale: number;
    topConcern: string;
    disciplinaryActions: number;
    additionalContext?: string;
};
export type TMonthlyCheckin = TCheckinInput & {
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export type TCheckin = TCheckinInput & {
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};
