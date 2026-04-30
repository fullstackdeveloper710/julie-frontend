export type BackendPlanId = 'founder' | 'essentials' | 'professional' | 'enterprise';

export interface PricingPlanFeatures {
  maxUsers: number;
  maxReports: number;
  aiReportsPerMonth: number;
  scenarioModels: number;
  advancedAnalytics: boolean;
  apiAccess: boolean;
  aiChat: boolean;
  adminSeats: number;
  holderSeats: number;
  additionalDeptAdminSeats?: number;
  additionalDeptHolderSeats?: number;
}

export interface FounderRules {
  billingPauseDays: number;
  minCommitmentMonths: number;
  requiredConsecutiveCheckins: number;
  earlyCancellationNote: string;
}

export interface PricingPlan {
  id: BackendPlanId;
  name: string;
  description: string;
  badge?: string;
  display: {
    priceLabel: string;
    priceIntervalLabel: string;
    priceNote?: string;
    promo?: string;
    ctaLabel: string;
  };
  featureHighlights: string[];
  features: PricingPlanFeatures;
  pricing: {
    monthly: number | null;
    annual: number | null;
  };
  available: boolean;
  annualSavings: string | null;
  // Only present on the Founder plan
  founderRules?: FounderRules;
}

export interface PricingResponse {
  plans: PricingPlan[];
  founderAvailable: boolean;
  founderSpotsRemaining: number;
  founderCapTotal: number;
  totalAgencies: number;
  // Legacy aliases
  foundingAvailable: boolean;
  remainingFoundingSpots: number;
}

import { buildBackendApiUrl } from '@/services/backend';

export const fetchPricingPlans = async (): Promise<PricingResponse> => {
  const response = await fetch(buildBackendApiUrl('/pricing'), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load pricing plans (${response.status})`);
  }

  return (await response.json()) as PricingResponse;
};
