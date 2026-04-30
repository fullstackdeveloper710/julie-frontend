import { PlanType, BillingInterval } from './subscription';

export interface PlanFeatures {
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

export interface PlanConfig {
  name: string;
  description: string;
  features: PlanFeatures;
  pricing: Record<BillingInterval, number | null>;
  badge?: string;
  isLocked?: boolean;
}

export const FOUNDER_PLAN = {
  monthly: 149,
  annual: 1639,
  cap: 20,
  billingPauseDays: 90,
  minCommitmentMonths: 12,
  requiredConsecutiveCheckins: 3,
} as const;

export const PRICING_CONFIG: Record<PlanType, PlanConfig> = {
  founder: {
    name: 'Founder',
    description: 'Full Professional access at a permanently locked rate',
    badge: 'FOUNDER',
    isLocked: true,
    features: {
      maxUsers: -1,
      maxReports: -1,
      aiReportsPerMonth: -1,
      scenarioModels: -1,
      advancedAnalytics: true,
      apiAccess: true,
      aiChat: true,
      adminSeats: 2,
      holderSeats: 1,
    },
    pricing: {
      monthly: FOUNDER_PLAN.monthly,
      annual: FOUNDER_PLAN.annual,
    },
  },
  essentials: {
    name: 'Essentials',
    description: 'Core tools for growing agencies',
    features: {
      maxUsers: -1,
      maxReports: -1,
      aiReportsPerMonth: -1,
      scenarioModels: -1,
      advancedAnalytics: true,
      apiAccess: false,
      aiChat: false,
      adminSeats: 2,
      holderSeats: 1,
    },
    pricing: { monthly: 199, annual: 2189 },
  },
  professional: {
    name: 'Professional',
    description: 'Full suite including all AI features',
    features: {
      maxUsers: -1,
      maxReports: -1,
      aiReportsPerMonth: -1,
      scenarioModels: -1,
      advancedAnalytics: true,
      apiAccess: true,
      aiChat: true,
      adminSeats: 2,
      holderSeats: 1,
    },
    pricing: { monthly: 499, annual: 4389 },
  },
  enterprise: {
    name: 'Government / Enterprise',
    description: 'Multi-department solutions',
    features: {
      maxUsers: -1,
      maxReports: -1,
      aiReportsPerMonth: -1,
      scenarioModels: -1,
      advancedAnalytics: true,
      apiAccess: true,
      aiChat: true,
      adminSeats: 4,
      holderSeats: 3,
      additionalDeptAdminSeats: 2,
      additionalDeptHolderSeats: 1,
    },
    pricing: { monthly: null, annual: 10000 },
  },
};

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  founder: PRICING_CONFIG.founder.features,
  essentials: PRICING_CONFIG.essentials.features,
  professional: PRICING_CONFIG.professional.features,
  enterprise: PRICING_CONFIG.enterprise.features,
};

// Calculation helpers — re-exported from utils/methods for backward compat
export { getPrice, getAnnualSavings, getEnterprisePrice, getSeats } from '@/utils/methods';
