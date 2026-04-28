/**
 * Display values are intentionally identical to the labels used in the
 * Annual Baseline form so agency data can prefill that form 1:1 without
 * extra mapping.
 */
export enum EAgencyType {
    LawEnforcement = 'Law enforcement',
    Fire = 'Fire',
    EMS = 'EMS',
    Dispatch = 'Dispatch',
    Combined = 'Combined',
}

export enum EAgencySize {
    SMALL = 'Small (<25)',
    MEDIUM = 'Medium (25-99)',
    LARGE = 'Large (100-299)',
    MAJOR = 'Major (300+)',
}

export enum EUserRole {
    USER = 'user',
    MANAGER = 'manager',
    VIEWER = 'viewer',
}

export enum EUserPlan {
    EARLY_ADOPTER = 'Early Adopter',
    STANDARD = 'Standard',
    ENTERPRISE = 'Enterprise',
}
