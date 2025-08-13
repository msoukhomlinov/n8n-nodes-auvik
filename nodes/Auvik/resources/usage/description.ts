import type { INodeProperties } from 'n8n-workflow';

export const usageOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['usage'],
    },
  },
  options: [
    {
      name: 'Get Client Usage',
      value: 'getClient',
      action: 'Get client usage',
    },
    {
      name: 'Get Device Usage',
      value: 'getDevice',
      action: 'Get device usage',
    },
  ],
  default: 'getClient',
};

export const usageFields: INodeProperties[] = [
  // Common date filters
  {
    displayName: 'Date Preset',
    name: 'datePreset',
    type: 'options',
    default: 'LAST_30_DAYS',
    options: [
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
    ],
    description: 'Quickly select a date range. Choose Custom to enter specific dates.',
    displayOptions: {
      show: {
        resource: ['usage'],
        operation: ['getClient', 'getDevice'],
      },
    },
  },
  {
    displayName: 'From Date',
    name: 'fromDate',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'YYYY-MM-DD',
    description: 'Date from which you want to query',
    displayOptions: {
      show: {
        resource: ['usage'],
        operation: ['getClient', 'getDevice'],
        datePreset: ['CUSTOM'],
      },
    },
  },
  {
    displayName: 'Thru Date',
    name: 'thruDate',
    type: 'string',
    default: '',
    required: true,
    placeholder: 'YYYY-MM-DD',
    description: 'Date to which you want to query',
    displayOptions: {
      show: {
        resource: ['usage'],
        operation: ['getClient', 'getDevice'],
        datePreset: ['CUSTOM'],
      },
    },
  },
  // Client usage specific
  {
    displayName: 'Tenants',
    name: 'tenants',
    type: 'multiOptions',
    typeOptions: { loadOptionsMethod: 'getTenants' },
    default: [],
    description: 'Select one or more tenants to query',
    displayOptions: {
      show: {
        resource: ['usage'],
        operation: ['getClient'],
      },
    },
  },
  // Device usage specific
  {
    displayName: 'Device',
    name: 'id',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getDevicesByTenant' },
    required: true,
    default: '',
    description: 'Select a device',
    displayOptions: {
      show: {
        resource: ['usage'],
        operation: ['getDevice'],
      },
    },
  },
];


