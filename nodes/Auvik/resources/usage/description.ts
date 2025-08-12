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
      },
    },
  },
  // Client usage specific
  {
    displayName: 'Tenants',
    name: 'tenants',
    type: 'string',
    default: '',
    description: 'Comma delimited list of tenant IDs to request info from',
    displayOptions: {
      show: {
        resource: ['usage'],
        operation: ['getClient'],
      },
    },
  },
  // Device usage specific
  {
    displayName: 'Device ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['usage'],
        operation: ['getDevice'],
      },
    },
  },
];


