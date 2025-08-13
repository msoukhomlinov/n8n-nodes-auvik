import type { INodeProperties } from 'n8n-workflow';

export const configurationOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['configuration'] } },
  options: [
    { name: 'Get Many', value: 'getMany', action: 'Get many configurations' },
    { name: 'Get One', value: 'getOne', action: 'Get one configuration' },
  ],
  default: 'getMany',
};

export const configurationFields: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: { show: { resource: ['configuration'], operation: ['getMany'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 10000 },
    default: 100,
    displayOptions: { show: { resource: ['configuration'], operation: ['getMany'], returnAll: [false] } },
  },
  {
    displayName: 'Tenants',
    name: 'tenants',
    type: 'multiOptions',
    typeOptions: { loadOptionsMethod: 'getTenants' },
    default: [],
    displayOptions: { show: { resource: ['configuration'], operation: ['getMany'] } },
  },
  { displayName: 'Device ID', name: 'filterDeviceId', type: 'string', default: '', displayOptions: { show: { resource: ['configuration'], operation: ['getMany'] } } },
  { displayName: 'Backup Time Preset', name: 'backupTimePreset', type: 'options', default: 'LAST_30_DAYS', options: [
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
  ], displayOptions: { show: { resource: ['configuration'], operation: ['getMany'] } } },
  { displayName: 'Backup Time After', name: 'filterBackupTimeAfter', type: 'string', default: '', description: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', displayOptions: { show: { resource: ['configuration'], operation: ['getMany'], backupTimePreset: ['CUSTOM'] } } },
  { displayName: 'Backup Time Before', name: 'filterBackupTimeBefore', type: 'string', default: '', description: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', displayOptions: { show: { resource: ['configuration'], operation: ['getMany'], backupTimePreset: ['CUSTOM'] } } },
  { displayName: 'Is Running', name: 'filterIsRunning', type: 'boolean', default: false, displayOptions: { show: { resource: ['configuration'], operation: ['getMany'] } } },
  { displayName: 'Configuration ID', name: 'id', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['configuration'], operation: ['getOne'] } } },
];


