import { USER_PLAN, USER_ROLE } from './enums';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role?: USER_ROLE;
  title?: string;
  status?: 'active' | 'inactive';
  createdBy?: string | null;
  plan?: USER_PLAN;
  agencies?: string[];
  hasActiveSubscription?: boolean;
  createdAt: string;
  updatedAt: string;
  showAgencyModal?: boolean;
}

export { USER_PLAN, USER_ROLE } from './enums';
export type { Agency } from './agency';
