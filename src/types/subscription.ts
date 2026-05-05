export { USER_PLAN, BILLING_INTERVAL } from './enums';
import { USER_PLAN, BILLING_INTERVAL } from './enums';
/** Alias kept for backward compatibility with existing imports of PlanType. */
export type PlanType = USER_PLAN;
/** Alias kept for backward compatibility with existing imports of BillingInterval. */
export type BillingInterval = BILLING_INTERVAL;

export interface Subscription {
  id: string;
  userId: string;
  agencyId: string | null;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  plan: PlanType;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  billingInterval: BillingInterval;

  isFoundingRate: boolean;
  foundingRateLockedPrice: number | null;      
  billingPausedUntil: string | null;           
  foundingRateActivatedAt: string | null;       
  foundingRateCommitmentEndDate: string | null; 
  consecutiveCheckins: number;                  
  foundingRateDowngradedAt: string | null;    

  // Testimonial tracking
  testimonialRequired: boolean;
  testimonialSubmitted: boolean;
  testimonialSubmittedAt: string | null;

  // Pricing lock
  pricingLocked: boolean;
  lockedPrice: number | null;
  lockedAt: string | null;

  // Check-in tracking
  monthlyCheckinsCount: number;
  lastCheckinAt: string | null;

  // Enterprise multi-agency
  numberOfAgencies: number;

  // Seats allocation
  managerSeats: number;
  departmentUserSeats: number;
  usedManagerSeats: number;
  usedDepartmentUserSeats: number;

  // Billing dates
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;

  createdAt: string;
  updatedAt: string;
}
