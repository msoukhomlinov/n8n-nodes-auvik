import type { INodeProperties } from 'n8n-workflow';

export const asmOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['asm'] } },
  options: [
    { name: 'Get Apps', value: 'getApps', action: 'Get ASM apps' },
    { name: 'Get Clients', value: 'getClients', action: 'Get ASM clients' },
    { name: 'Get Security Logs', value: 'getSecurityLogs', action: 'Get ASM security logs' },
    { name: 'Get Tags', value: 'getTags', action: 'Get ASM tags' },
    { name: 'Get Users', value: 'getUsers', action: 'Get ASM users' },
  ],
  default: 'getApps',
};

export const asmFields: INodeProperties[] = [
  // Common filters
  { displayName: 'Client ID', name: 'clientId', type: 'string', default: '', displayOptions: { show: { resource: ['asm'], operation: ['getApps', 'getSecurityLogs', 'getTags', 'getUsers'] } } },
  { displayName: 'Query Date Preset', name: 'queryDatePreset', type: 'options', default: 'LAST_30_DAYS', options: [
    { name: 'Today', value: 'TODAY' },
    { name: 'Yesterday', value: 'YESTERDAY' },
    { name: 'Last 24 hours', value: 'LAST_24_HOURS' },
    { name: 'Last 48 hours', value: 'LAST_48_HOURS' },
    { name: 'Last 7 days', value: 'LAST_7_DAYS' },
    { name: 'Last 14 days', value: 'LAST_14_DAYS' },
    { name: 'Last 30 days', value: 'LAST_30_DAYS' },
    { name: 'Last 90 days', value: 'LAST_90_DAYS' },
    { name: 'This week', value: 'THIS_WEEK' },
    { name: 'This month', value: 'THIS_MONTH' },
    { name: 'Last month', value: 'LAST_MONTH' },
    { name: 'Quarter to date', value: 'QUARTER_TO_DATE' },
    { name: 'Year to date', value: 'YEAR_TO_DATE' },
    { name: 'Custom', value: 'CUSTOM' },
  ], displayOptions: { show: { resource: ['asm'], operation: ['getApps', 'getClients', 'getSecurityLogs'] } } },
  { displayName: 'Query Date', name: 'queryDate', type: 'string', default: '', description: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', displayOptions: { show: { resource: ['asm'], operation: ['getApps', 'getClients', 'getSecurityLogs'], queryDatePreset: ['CUSTOM'] } } },
  { displayName: 'Include', name: 'include', type: 'string', default: '', description: 'Comma list (e.g., users,contracts)', displayOptions: { show: { resource: ['asm'], operation: ['getApps', 'getSecurityLogs', 'getClients'] } } },
  { displayName: 'Application ID', name: 'applicationId', type: 'string', default: '', displayOptions: { show: { resource: ['asm'], operation: ['getTags'] } } },
];


