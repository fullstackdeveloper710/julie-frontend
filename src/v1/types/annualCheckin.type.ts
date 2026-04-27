import { Types } from 'mongoose';
import { BinaryAnswer } from './checkin.type';

export type AnnualAgencyType = 'Law enforcement' | 'Fire' | 'EMS' | 'Dispatch' | 'Combined';
export type AnnualAgencySize = 'Small (<25)' | 'Medium (25-99)' | 'Large (100-299)' | 'Major (300+)';
export type ShiftScheduleType = '8-hour' | '10-hour' | '12-hour' | 'Mixed';
export type PeerSupportTeamStatus = 'Yes' | 'No' | 'In development';
export type Goal1Timeframe = 'Annual (Q1-Q4)' | 'First half (Q1-Q2)' | 'Second half (Q3-Q4)';
export type Goal2Timeframe = 'Annual' | 'First half' | 'Second half';

export interface IAgencyIdentity {
    agencyName: string;
    agencyType: AnnualAgencyType;
    agencySizeCategory: AnnualAgencySize;
    primaryServiceJurisdiction: string;
    geographicCoverageArea: number;
}

export interface IStructuralStaffingProfile {
    totalAuthorizedPositions: number;
    totalFundedPositions: number;
    minimumSafeStaffingLevel: number;
    specialtyUnitPositionsCount: number;
    supervisorToStaffRatio: string;
}

export interface IOperationalInfrastructure {
    standardShiftLengthHours: number;
    shiftScheduleType: ShiftScheduleType;
    minimumRestPeriodPolicyExists: BinaryAnswer;
    activePeerSupportTeam: PeerSupportTeamStatus;
    hasEmployeeAssistanceProgram: BinaryAnswer;
}

export interface IGoalsAndStrategicDirection {
    goal1PrimaryAnnualGoal: string;
    goal1TargetMetric?: string;
    goal1Timeframe: Goal1Timeframe;
    goal2SecondaryAnnualGoal?: string;
    goal2TargetMetric?: string;
    goal2Timeframe?: Goal2Timeframe;
}

export interface IAnnualCheckinInput {
    agencyIdentity: IAgencyIdentity;
    structuralStaffingProfile: IStructuralStaffingProfile;
    operationalInfrastructure: IOperationalInfrastructure;
    goalsAndStrategicDirection: IGoalsAndStrategicDirection;
    baselineYear?: Date | string;
}

export interface IAnnualCheckin {
    userId: Types.ObjectId;
    baselineYear: Date;
    agencyIdentity: IAgencyIdentity;
    structuralStaffingProfile: IStructuralStaffingProfile;
    operationalInfrastructure: IOperationalInfrastructure;
    goalsAndStrategicDirection: IGoalsAndStrategicDirection;
    createdAt: Date;
    updatedAt: Date;
}
