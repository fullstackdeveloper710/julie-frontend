import type { PlanType, BillingInterval } from '@/types/subscription';
import { USER_PLAN } from '@/types/enums';
import { PRICING_CONFIG } from '@/types/plans';

// ── Date ────────────────────────────────────────────────────────────────────

export const formatYear = (iso: string | undefined): number | string => {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '—' : d.getUTCFullYear();
};

// ── Pricing ──────────────────────────────────────────────────────────────────

export const getPrice = (plan: PlanType, interval: BillingInterval): number | null =>
  PRICING_CONFIG[plan].pricing[interval];

export const getAnnualSavings = (plan: PlanType): string | null => {
  const monthly = PRICING_CONFIG[plan].pricing.monthly;
  const annual = PRICING_CONFIG[plan].pricing.annual;
  if (!monthly || !annual) return null;
  const saved = monthly * 12 - annual;
  if (saved <= 0) return null;
  return `${((saved / (monthly * 12)) * 100).toFixed(0)}%`;
};

export const getEnterprisePrice = (numberOfDepts: number): number => {
  const base = PRICING_CONFIG.enterprise.pricing.annual ?? 10000;
  return base + (numberOfDepts - 1) * 3000;
};

export const getSeats = (plan: PlanType, numberOfDepts: number = 1) => {
  const cfg = PRICING_CONFIG[plan].features;
  if (plan === USER_PLAN.ENTERPRISE) {
    const extra = numberOfDepts - 1;
    return {
      adminSeats: cfg.adminSeats + extra * (cfg.additionalDeptAdminSeats ?? 0),
      holderSeats: cfg.holderSeats + extra * (cfg.additionalDeptHolderSeats ?? 0),
    };
  }
  return { adminSeats: cfg.adminSeats, holderSeats: cfg.holderSeats };
};
