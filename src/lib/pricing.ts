export type BackendPlanId = 'founding' | 'early_adopter' | 'standard' | 'enterprise';

export interface PricingPlanFeatures {
  maxUsers: number;
  maxReports: number;
  aiReportsPerMonth: number;
  scenarioModels: number;
  advancedAnalytics: boolean;
  apiAccess: boolean;
  trialDays: number | null;
  adminSeats: number;
  viewerSeats: number;
  additionalAgencyAdminSeats?: number;
  additionalAgencyViewerSeats?: number;
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
}

export interface PricingResponse {
  plans: PricingPlan[];
  foundingAvailable: boolean;
  remainingFoundingSpots: number;
  totalAgencies: number;
}

import { buildBackendApiUrl } from '@/services/backend';

export const fetchPricingPlans = async (): Promise<PricingResponse> => {
  const response = await fetch(buildBackendApiUrl('/pricing'), {
    cache: 'no-store',
  });

  console.log(response);

  if (!response.ok) {
    throw new Error(`Failed to load pricing plans (${response.status})`);
  }

  return (await response.json()) as PricingResponse;
};
