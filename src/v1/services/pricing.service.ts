import { Types } from 'mongoose';
import Agency from '../models/agency.model';
import PricingPlan, { IPricingPlan } from '../models/pricingPlan.model';
import Subscription from '../models/subscription.model';

// ── Constants ────────────────────────────────────────────────────────────────

export const FOUNDER_CAP = 20;
export const FOUNDER_MONTHLY = 149;
export const FOUNDER_ANNUAL = 1639;        // 149 × 11
export const FOUNDER_BILLING_PAUSE_DAYS = 90;
export const FOUNDER_COMMITMENT_MONTHS = 12;
export const FOUNDER_REQUIRED_CHECKINS = 3;

// ── Types ────────────────────────────────────────────────────────────────────

type PublicPlanId = 'founder' | 'essentials' | 'professional' | 'enterprise';

interface PublicPricingPlan {
    id: PublicPlanId;
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
    features: {
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
    };
    pricing: {
        monthly: number | null;
        annual: number | null;
    };
    available: boolean;
    annualSavings: string | null;
    founderRules?: {
        billingPauseDays: number;
        minCommitmentMonths: number;
        requiredConsecutiveCheckins: number;
        earlyCancellationNote: string;
    };
}

// ── Plan definitions ─────────────────────────────────────────────────────────

const ALL_PLANS: Array<Omit<PublicPricingPlan, 'available' | 'annualSavings'>> = [
    {
        id: 'founder',
        name: 'Founder',
        description: 'Full Professional access at a permanently locked rate',
        badge: 'FOUNDER',
        display: {
            priceLabel: `$${FOUNDER_MONTHLY}`,
            priceIntervalLabel: '/mo',
            priceNote: `$${FOUNDER_ANNUAL}/yr · Price locked forever`,
            promo: `${FOUNDER_BILLING_PAUSE_DAYS}-day billing pause included`,
            ctaLabel: 'Claim Founding Rate',
        },
        featureHighlights: [
            'Everything in Professional',
            'Price locked for life — never auto-upgraded',
            `${FOUNDER_BILLING_PAUSE_DAYS}-day billing suspension · activates month 4`,
            `${FOUNDER_COMMITMENT_MONTHS}-month minimum commitment`,
            `Must maintain ${FOUNDER_REQUIRED_CHECKINS} consecutive monthly check-ins`,
        ],
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
            monthly: FOUNDER_MONTHLY,
            annual: FOUNDER_ANNUAL,
        },
        founderRules: {
            billingPauseDays: FOUNDER_BILLING_PAUSE_DAYS,
            minCommitmentMonths: FOUNDER_COMMITMENT_MONTHS,
            requiredConsecutiveCheckins: FOUNDER_REQUIRED_CHECKINS,
            earlyCancellationNote: `Full annual amount ($${FOUNDER_ANNUAL}) charged on early cancellation`,
        },
    },
    {
        id: 'essentials',
        name: 'Essentials',
        description: 'Core tools for growing agencies',
        display: {
            priceLabel: '$199',
            priceIntervalLabel: '/mo',
            priceNote: '$2,189/yr · Annual saves 1 month',
            ctaLabel: 'Get Started',
        },
        featureHighlights: [
            'Full platform access',
            'All Intelligence Report features',
            'Limited feature set',
            'No minimum commitment',
        ],
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
    {
        id: 'professional',
        name: 'Professional',
        description: 'Full suite including all AI features',
        display: {
            priceLabel: '$499',
            priceIntervalLabel: '/mo',
            priceNote: '$4,389/yr · Annual saves 1 month',
            ctaLabel: 'Get Started',
        },
        featureHighlights: [
            'Everything in Essentials',
            'AI Chat',
            'API access',
            'No minimum commitment',
        ],
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
    {
        id: 'enterprise',
        name: 'Government / Enterprise',
        description: 'Multi-department solutions',
        display: {
            priceLabel: '$10K',
            priceIntervalLabel: '/yr',
            priceNote: 'Base · +$3K/yr per add-on department',
            ctaLabel: 'Get Started',
        },
        featureHighlights: [
            'All Professional features',
            '1 master holder + 2 dept holders + 4 dept admins (7 seats)',
            '+3 seats per additional department',
            'Dedicated support',
        ],
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
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const calcAnnualSavings = (pricing: { monthly: number | null; annual: number | null }): string | null => {
    const { monthly, annual } = pricing;
    if (!monthly || !annual) return null;
    const saved = monthly * 12 - annual;
    if (saved <= 0) return null;
    const pct = ((saved / (monthly * 12)) * 100).toFixed(0);
    return `${pct}% ($${saved.toLocaleString()})`;
};

export const getActiveFounderCount = async (): Promise<number> =>
    Subscription.countDocuments({
        plan: 'founder',
        foundingRateDowngradedAt: null,
    });

export const isFounderPlanAvailable = async (): Promise<boolean> => {
    const count = await getActiveFounderCount();
    return count < FOUNDER_CAP;
};

// ── Seed helper ──────────────────────────────────────────────────────────────

const ensurePricingPlans = async () => {
    for (const [index, plan] of ALL_PLANS.entries()) {
        await PricingPlan.updateOne(
            { planKey: plan.id },
            {
                $setOnInsert: {
                    planKey: plan.id,
                    sortOrder: index + 1,
                    isActive: true,
                    foundingAgencyLimit: plan.id === 'founder' ? FOUNDER_CAP : null,
                    hideWhenSoldOut: plan.id === 'founder',
                    name: plan.name,
                    description: plan.description,
                    badge: plan.badge,
                    display: plan.display,
                    featureHighlights: plan.featureHighlights,
                    features: plan.features,
                    pricing: plan.pricing,
                    founderRules: plan.founderRules,
                },
            },
            { upsert: true }
        );
    }
};

// ── Public API ───────────────────────────────────────────────────────────────

export const getPricingPlans = async () => {
    await ensurePricingPlans();

    const totalAgencies = await Agency.countDocuments({});
    const activeFounderCount = await getActiveFounderCount();
    const founderAvailable = totalAgencies < FOUNDER_CAP;
    const founderSpotsRemaining = Math.max(FOUNDER_CAP - totalAgencies, 0);

    const planDocs = await PricingPlan.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });

    const plans: PublicPricingPlan[] = planDocs
        .map((doc: IPricingPlan) => {
            const base = ALL_PLANS.find((p) => p.id === doc.planKey);
            if (!base) return null;
            return {
                ...base,
                available: true,
                annualSavings: calcAnnualSavings(doc.pricing),
            } as PublicPricingPlan;
        })
        .filter((p): p is PublicPricingPlan => p !== null)
        .filter((p) => {
            if (p.id === 'founder') return founderAvailable;
            if (p.id === 'professional') return !founderAvailable;
            return true;
        });

    return {
        plans,
        founderAvailable,
        founderSpotsRemaining,
        founderCapTotal: FOUNDER_CAP,
        totalAgencies,
        foundingAvailable: founderAvailable,
        remainingFoundingSpots: founderSpotsRemaining,
    };
};