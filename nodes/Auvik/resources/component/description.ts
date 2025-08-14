import type { INodeProperties } from 'n8n-workflow';

export const componentOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['component'],
    },
  },
  options: [
    { name: 'Get Many', value: 'getMany', action: 'Get many components info' },
    { name: 'Get One', value: 'getOne', action: 'Get one component info' },
  ],
  default: 'getMany',
};

export const componentFields: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: { show: { resource: ['component'], operation: ['getMany'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 10000 },
    default: 100,
    displayOptions: { show: { resource: ['component'], operation: ['getMany'], returnAll: [false] } },
  },
  {
    displayName: 'Tenants',
    name: 'tenants',
    type: 'multiOptions',
    typeOptions: { loadOptionsMethod: 'getTenants' },
    default: [],
    displayOptions: { show: { resource: ['component'], operation: ['getMany'] } },
  },
  { displayName: 'Modified After', name: 'filterModifiedAfter', type: 'string', default: '', placeholder: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', description: 'Lower bound of modified time (ISO 8601 UTC)', displayOptions: { show: { resource: ['component'], operation: ['getMany'] } } },
  { displayName: 'Device ID', name: 'filterDeviceId', type: 'string', default: '', displayOptions: { show: { resource: ['component'], operation: ['getMany'] } } },
  { displayName: 'Device Name', name: 'filterDeviceName', type: 'string', default: '', displayOptions: { show: { resource: ['component'], operation: ['getMany'] } } },
  {
    displayName: 'Current Status',
    name: 'filterCurrentStatus',
    type: 'options',
    options: [
      { name: 'OK', value: 'ok' },
      { name: 'Degraded', value: 'degraded' },
      { name: 'Failed', value: 'failed' },
    ],
    default: 'ok',
    displayOptions: { show: { resource: ['component'], operation: ['getMany'] } },
  },
  {
    displayName: 'Component ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['component'], operation: ['getOne'] } },
  },
];


