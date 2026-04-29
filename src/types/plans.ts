import { SubscriptionPlanKey as PlanType, BillingInterval } from '@/redux/api/subscriptionApi';

export interface PlanFeatures {
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

export interface PlanPrice {
  monthly: number | null; // null = not available
  annual: number | null; // null = not available
  description?: string;
}

export interface PlanConfig {
  name: string;
  description: string;
  features: PlanFeatures;
  pricing: Record<BillingInterval, number | null>;
  badge?: string;
  isLocked?: boolean; // For founding tier permanent pricing
}

// Pricing configuration - config-driven approach
export const PRICING_CONFIG: Record<PlanType, PlanConfig> = {
  founding: {
    name: 'Founding',
    description: 'Perfect for early adopters',
    badge: 'Founding Rate',
    features: {
      maxUsers: 3,
      maxReports: -1,
      aiReportsPerMonth: -1,
      scenarioModels: -1,
      advancedAnalytics: true,
      apiAccess: false,
      trialDays: 90,
      adminSeats: 2,
      viewerSeats: 1,
    },
    pricing: {
      monthly: 149,
      annual: 1499,
    },
    isLocked: true,
  },
  early_adopter: {
    name: 'Early Adopter',
    description: 'Growing agencies',
    features: {
      maxUsers: 15,
      maxReports: -1,
      aiReportsPerMonth: -1,
      scenarioModels: -1,
      advancedAnalytics: true,
      apiAccess: false,
      trialDays: null,
      adminSeats: 2,
      viewerSeats: 1,
    },
    pricing: {
      monthly: 249,
      annual: 2739,
    },
  },
  standard: {
    name: 'Standard',
    description: 'Established agencies',
    features: {
      maxUsers: -1,
      maxReports: -1,
      aiReportsPerMonth: -1,
      scenarioModels: -1,
      advancedAnalytics: true,
      apiAccess: true,
      trialDays: null,
      adminSeats: 2,
      viewerSeats: 1,
    },
    pricing: {
      monthly: 499,
      annual: 5489,
    },
  },
  enterprise: {
    name: 'Government / Enterprise',
    description: 'Multi-agency solutions',
    features: {
      maxUsers: -1,
      maxReports: -1,
      aiReportsPerMonth: -1,
      scenarioModels: -1,
      advancedAnalytics: true,
      apiAccess: true,
      trialDays: null,
      adminSeats: 4,
      viewerSeats: 2,
      additionalAgencyAdminSeats: 2,
      additionalAgencyViewerSeats: 1,
    },
    pricing: {
      monthly: null, // Enterprise only supports annual
      annual: 7000, // First agency; +$2000 per additional
    },
  },
};

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  founding: PRICING_CONFIG.founding.features,
  early_adopter: PRICING_CONFIG.early_adopter.features,
  standard: PRICING_CONFIG.standard.features,
  enterprise: PRICING_CONFIG.enterprise.features,
};

// Helper functions
export const getFoundingPrice = (interval: BillingInterval): number => {
  return PRICING_CONFIG.founding.pricing[interval] || 0;
};

export const getPrice = (plan: PlanType, interval: BillingInterval): number | null => {
  return PRICING_CONFIG[plan].pricing[interval];
};

export const getAnnualSavings = (plan: PlanType): string | null => {
  const monthly = PRICING_CONFIG[plan].pricing.monthly;
  const annual = PRICING_CONFIG[plan].pricing.annual;

  if (!monthly || !annual) return null;

  const monthlyTotal = monthly * 12;
  const savings = (((monthlyTotal - annual) / monthlyTotal) * 100).toFixed(0);
  return `${savings}%`;
};

export const getEnterprisePrice = (numberOfAgencies: number): number => {
  const firstAgency = PRICING_CONFIG.enterprise.pricing.annual || 7000;
  const additionalPrice = 2000;
  return firstAgency + (numberOfAgencies - 1) * additionalPrice;
};

export const getSeats = (plan: PlanType, numberOfAgencies: number = 1) => {
  const config = PRICING_CONFIG[plan].features;

  if (plan === 'enterprise') {
    const additionalAgencies = numberOfAgencies - 1;
    return {
      adminSeats: config.adminSeats + additionalAgencies * (config.additionalAgencyAdminSeats || 0),
      viewerSeats:
        config.viewerSeats + additionalAgencies * (config.additionalAgencyViewerSeats || 0),
    };
  }

  return {
    adminSeats: config.adminSeats,
    viewerSeats: config.viewerSeats,
  };
};
