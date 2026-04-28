import Agency from '../models/agency.model';
import PricingPlan, { IPricingPlan } from '../models/pricingPlan.model';

const FOUNDING_SPOT_LIMIT = 20;

type PublicPlanId = 'founding' | 'early_adopter' | 'standard' | 'enterprise';

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
        trialDays: number | null;
        adminSeats: number;
        viewerSeats: number;
        additionalAgencyAdminSeats?: number;
        additionalAgencyViewerSeats?: number;
    };
    pricing: {
        monthly: number | null;
        annual: number | null;
    };
    available: boolean;
    annualSavings: string | null;
}

const PRICING_PLANS: Array<Omit<PublicPricingPlan, 'available' | 'annualSavings'>> = [
    {
        id: 'founding',
        name: 'Founding',
        description: 'Perfect for early adopters',
        badge: 'Founding Rate',
        display: {
            priceLabel: '$149',
            priceIntervalLabel: '/mo',
            priceNote: 'Locked forever after trial',
            promo: 'Free 90 days to start',
            ctaLabel: 'Claim Founding Rate',
        },
        featureHighlights: [
            '90-day free trial',
            'Locked for life price on activation',
            'Full platform access',
            'All Intelligence Report features',
        ],
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
    },
    {
        id: 'early_adopter',
        name: 'Early Adopter',
        description: 'Growing agencies',
        display: {
            priceLabel: '$249',
            priceIntervalLabel: '/mo',
            priceNote: 'Best for teams getting established',
            ctaLabel: 'Get Started',
        },
        featureHighlights: [
            'Full platform access',
            'All Intelligence Report features',
        ],
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
    {
        id: 'standard',
        name: 'Standard',
        description: 'Established agencies',
        display: {
            priceLabel: '$499',
            priceIntervalLabel: '/mo',
            priceNote: 'Annual billing saves 8-10%',
            ctaLabel: 'Get Started',
        },
        featureHighlights: [
            'API access',
            'Full platform access',
            'All Intelligence Report features',
        ],
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
    {
        id: 'enterprise',
        name: 'Government / Enterprise',
        description: 'Multi-agency solutions',
        display: {
            priceLabel: '$7K',
            priceIntervalLabel: '/yr',
            priceNote: 'First dept + $2K each additional',
            ctaLabel: 'Get Started',
        },
        featureHighlights: [
            'Multi-department access',
            'Dedicated support',
            'API access',
        ],
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
            monthly: null,
            annual: 7000,
        },
    },
];

const getAnnualSavings = (pricing: { monthly: number | null; annual: number | null }): string | null => {
    const { monthly, annual } = pricing;

    if (!monthly || !annual) {
        return null;
    }

    const monthlyTotal = monthly * 12;
    const savings = (((monthlyTotal - annual) / monthlyTotal) * 100).toFixed(0);
    return `${savings}%`;
};

const ensurePricingPlans = async () => {
    await PricingPlan.bulkWrite(
        PRICING_PLANS.map((plan, index) => ({
            updateOne: {
                filter: { planKey: plan.id },
                update: {
                    $setOnInsert: {
                        ...plan,
                        planKey: plan.id,
                        sortOrder: index + 1,
                        isActive: true,
                        foundingAgencyLimit: plan.id === 'founding' ? FOUNDING_SPOT_LIMIT : null,
                        hideWhenSoldOut: plan.id === 'founding',
                    },
                },
                upsert: true,
            },
        }))
    );
};

export const getPricingPlans = async () => {
    await ensurePricingPlans();

    const totalAgencies = await Agency.countDocuments({});
    const planDocs = await PricingPlan.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 });

    const plans: PublicPricingPlan[] = planDocs
        .map((plan: IPricingPlan) => ({
            id: plan.planKey as PublicPlanId,
            name: plan.name,
            description: plan.description,
            badge: plan.badge,
            display: plan.display,
            featureHighlights: plan.featureHighlights,
            features: plan.features,
            pricing: plan.pricing,
            available: !plan.hideWhenSoldOut || totalAgencies < (plan.foundingAgencyLimit || 0),
            annualSavings: getAnnualSavings(plan.pricing),
        }))
        .filter((plan) => plan.available);

    const foundingPlan = planDocs.find((plan) => plan.planKey === 'founding');
    const foundingLimit = foundingPlan?.foundingAgencyLimit || FOUNDING_SPOT_LIMIT;
    const foundingAvailable = totalAgencies < foundingLimit;
    const remainingFoundingSpots = Math.max(foundingLimit - totalAgencies, 0);

    return {
        plans,
        foundingAvailable,
        remainingFoundingSpots,
        totalAgencies,
    };
};