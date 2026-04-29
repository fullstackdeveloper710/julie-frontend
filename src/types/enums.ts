// ANSWER TYPES
export type BinaryAnswer = 'Yes' | 'No';
export type TernaryAnswer = 'Yes' | 'No' | 'Partially';

// DATA QUALITY TYPES
export type DataConfidenceLevel = 'High' | 'Moderate' | 'Low';

// AGENCY TYPES
export type AgencyType = 'Law enforcement' | 'Fire' | 'EMS' | 'Dispatch' | 'Combined';

/** Size category of agency */
export type AgencySizeCategory = 'Small (<25)' | 'Medium (25-99)' | 'Large (100-299)' | 'Major (300+)';

// OPERATIONAL TYPES
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

export type ShiftScheduleType = '8-hour' | '10-hour' | '12-hour' | 'Mixed';
export type PeerSupportTeamStatus = 'Yes' | 'No' | 'In development';
export type GoalTimeframe = 'Annual (Q1-Q4)' | 'First half (Q1-Q2)' | 'Second half (Q3-Q4)';
export type SecondaryGoalTimeframe = 'Annual' | 'First half' | 'Second half';

// USER ROLE TYPES
export type UserRole = 'user' | 'manager' | 'viewer';
export type UserPlan = 'Early Adopter' | 'Standard' | 'Enterprise';
export type UserStatus = 'active' | 'inactive';

// BILLING TYPES
export type BillingInterval = 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

// REPORT TYPES
export type ReportStatus = 'draft' | 'published' | 'archived';
export type ReportFormat = 'pdf' | 'excel' | 'json';
