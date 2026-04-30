// ── Agency ──────────────────────────────────────────────────────────────────
export type AgencyType = 'Law enforcement' | 'Fire' | 'EMS' | 'Dispatch' | 'Combined';
export type AgencySizeCategory = 'Small (<25)' | 'Medium (25-99)' | 'Large (100-299)' | 'Major (300+)';

// ── Monthly check-in string unions ──────────────────────────────────────────
export type DataConfidenceLevel = 'High' | 'Moderate' | 'Low';
export type BinaryAnswer = 'Yes' | 'No';
export type TernaryAnswer = 'Yes' | 'No' | 'Partially';
export type HiringBudgetAvailability = 'Full' | 'Limited' | 'Frozen';
export type StaffingBudgetConstraint = 'Yes' | 'No' | 'Under review';
export type RestRequirementMet = 'Yes' | 'No' | 'No policy';
export type PtoBacklog = 'Yes' | 'No' | 'Some personnel affected';
export type TopLeadershipConcern =
  | 'Staffing shortage'
  | 'Budget strain'
  | 'Burnout concerns'
  | 'Leadership turnover'
  | 'Morale'
  | 'Legal or compliance'
  | 'Other';

// ── Annual check-in string unions ────────────────────────────────────────────
export type ShiftScheduleType = '8-hour' | '10-hour' | '12-hour' | 'Mixed';
export type PeerSupportTeamStatus = 'Yes' | 'No' | 'In development';
export type GoalTimeframe = 'Annual (Q1-Q4)' | 'First half (Q1-Q2)' | 'Second half (Q3-Q4)';
export type SecondaryGoalTimeframe = 'Annual' | 'First half' | 'Second half';

// ── Plans / Roles / Billing ──────────────────────────────────────────────────
export enum USER_PLAN {
  FOUNDER = 'founder',
  ESSENTIALS = 'essentials',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum USER_ROLE {
  USER = 'user',
  MANAGER = 'manager',
  VIEWER = 'viewer',
}

export enum BILLING_INTERVAL {
  MONTHLY = 'monthly',
  ANNUAL = 'annual',
}

export type UserRole = USER_ROLE;
export type UserPlan = USER_PLAN;
export type BillingInterval = BILLING_INTERVAL;
export type UserStatus = 'active' | 'inactive';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';
export type ReportStatus = 'draft' | 'published' | 'archived';
export type ReportFormat = 'pdf' | 'excel' | 'json';
