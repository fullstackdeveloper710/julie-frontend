export type PlanType = 'founding' | 'early_adopter' | 'standard' | 'enterprise';
export type BillingInterval = 'monthly' | 'annual';

export interface Subscription {
  id: string;
  userId: string;
  agencyId: string | null;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  plan: PlanType;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  billingInterval: BillingInterval;

  // Trial tracking
  trialStartDate: string | null;
  trialEndDate: string | null;
  trialDaysRemaining: number | null;
  isTrialEnded: boolean;

  // Testimonial tracking
  testimonialRequired: boolean;
  testimonialSubmitted: boolean;
  testimonialSubmittedAt: string | null;

  // Pricing lock (for founding tier)
  pricingLocked: boolean;
  lockedPrice: number | null;
  lockedAt: string | null;

  // Check-in tracking
  monthlyCheckinsCount: number;
  lastCheckinAt: string | null;

  // Enterprise multi-agency
  numberOfAgencies: number; // For enterprise tier

  // Seats allocation
  adminSeats: number;
  viewerSeats: number;
  usedAdminSeats: number;
  usedViewerSeats: number;

  // Billing dates
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;

  createdAt: string;
  updatedAt: string;
}
