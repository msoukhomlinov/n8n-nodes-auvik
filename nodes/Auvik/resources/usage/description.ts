import type { INodeProperties } from 'n8n-workflow';
import { dateTimePresetOptions } from '../../helpers/options/datePresets';

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
    default: 'NO_FILTER',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }],
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


