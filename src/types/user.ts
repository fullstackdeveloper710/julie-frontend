import { UserPlan, UserRole } from './enums';
import type { Agency } from './agency';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  title?: string;
  status?: 'active' | 'inactive';
  createdBy?: string | null;
  plan?: UserPlan | string;
  agencies?: string[];
  createdAt: string;
  updatedAt: string;
  showAgencyModal?: boolean;
}

// Re-export for backward compatibility
export type { UserPlan, UserRole } from './enums';
export type { Agency } from './agency';
