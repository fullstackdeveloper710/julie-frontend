export const agencyQuestions = [
  {
    id: 'agencyName',
    label: 'Agency name',
    type: 'text',
  },
  {
    id: 'agencyType',
    label: 'Agency type',
    type: 'select',
    options: [
      { label: 'Law Enforcement', value: 'LawEnforcement' },
      { label: 'Fire Department', value: 'FireDepartment' },
      { label: 'EMS', value: 'EMS' },
      { label: 'Dispatch', value: 'Dispatch' },
      { label: 'Combined', value: 'Combined' },
    ],
  },
  {
    id: 'agencySize',
    label: 'Agency size category',
    type: 'select',
    options: [
      { label: 'Small ', value: 'Small' },
      { label: 'Medium ', value: 'Medium' },
      { label: 'Large ', value: 'Large' },
      { label: 'Major', value: 'Major' },
    ],
  },
  {
    id: 'jurisdiction',
    label: 'Primary service jurisdiction',
    type: 'text',
  },
  {
    id: 'coverage',
    label: 'Geographic coverage area',
    type: 'number',
  },
];
