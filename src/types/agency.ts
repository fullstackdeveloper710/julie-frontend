export interface Agency {
  _id: string; // MongoDB ObjectId
  name: string;
  type: 'Law enforcement' | 'Fire' | 'EMS' | 'Dispatch' | 'Combined';
  sizeCategory: 'Small (<25)' | 'Medium (25-99)' | 'Large (100-299)' | 'Major (300+)';
  primaryServiceJurisdiction: string;
  coverageArea: number;
  createdBy: string; 
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  members?: string[];
  subscription?: string;
}

/**
 * Agency creation/update request payload
 */
export interface AgencyPayload {
  name: string;
  type: 'Law enforcement' | 'Fire' | 'EMS' | 'Dispatch' | 'Combined';
  sizeCategory: 'Small (<25)' | 'Medium (25-99)' | 'Large (100-299)' | 'Major (300+)';
  primaryServiceJurisdiction: string;
  coverageArea: number;
}

/**
 * Agency with computed properties (for display)
 */
export interface AgencyWithCapacity extends Agency {
  capacity?: {
    canCreateMore: boolean;
    canEditMore: boolean;
    membersCount: number;
  };
}
