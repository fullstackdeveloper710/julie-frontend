export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
  showAgencyModal?: boolean;
}

export interface Agency {
  id: string;
  userId: string;
  name: string;
  type: 'Law Enforcement' | 'Fire Department' | 'EMS / Emergency Medical' | '911 Dispatch' | 'Corrections' | 'Government / Enterprise';
  createdAt: string;
  updatedAt: string;
}
