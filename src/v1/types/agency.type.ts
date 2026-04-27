import { EAgencyType, EAgencySize } from "../enums/agency.enum.js";

export type TAgencyInput = {
    name: string;
    type: EAgencyType;
    sizeCategory: EAgencySize;
    primaryServiceJurisdiction: string;
    coverageArea: number; // square miles or zone count
};

export type TAgency = TAgencyInput & {
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};
