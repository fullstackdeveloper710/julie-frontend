export type UserPlan = 'Early Adopter' | 'Standard' | 'Enterprise';

export type UserRole = 'user' | 'manager' | 'viewer';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  title?: string;
  createdBy?: string | null;
  plan?: UserPlan | string;
  agencies?: string[];
  createdAt: string;
  updatedAt: string;
  showAgencyModal?: boolean;
}

export interface Agency {
  id: string;
  userId: string;
  name: string;
  type:
    | 'Law enforcement'
    | 'Fire'
    | 'EMS'
    | 'Dispatch'
    | 'Combined';
  sizeCategory:
    | 'Small (<25)'
    | 'Medium (25-99)'
    | 'Large (100-299)'
    | 'Major (300+)';
  primaryServiceJurisdiction: string;
  coverageArea: number;
  createdAt: string;
  updatedAt: string;
}
