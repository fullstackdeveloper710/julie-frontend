import type { AgencyInput, AgencyType } from '@/redux/api/agencyApi';
import type { Agency } from '@/redux/api/agencyApi';
import { AgencyFormValues, AGENCY_INITIAL_VALUES } from './types';

export const buildAgencyPayload = (values: AgencyFormValues): AgencyInput => {
  return {
    name: values.name.trim(),
    type: values.type as AgencyType,
    sizeCategory: values.sizeCategory as AgencyInput['sizeCategory'],
    primaryServiceJurisdiction: values.primaryServiceJurisdiction.trim(),
    coverageArea: Number(values.coverageArea),
  };
};

export const agencyToFormValues = (agency: Agency | undefined): AgencyFormValues => {
  if (!agency) return AGENCY_INITIAL_VALUES;
  return {
    name: agency.name ?? '',
    type: agency.type ?? '',
    sizeCategory: agency.sizeCategory ?? '',
    primaryServiceJurisdiction: agency.primaryServiceJurisdiction ?? '',
    coverageArea:
      agency.coverageArea !== undefined && agency.coverageArea !== null
        ? String(agency.coverageArea)
        : '',
  };
};
