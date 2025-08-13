import type { INodeProperties } from 'n8n-workflow';

export const alertHistoryOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['alertHistory'],
    },
  },
  options: [
    {
      name: 'Get Many',
      value: 'getMany',
      action: 'Get many alerts history',
    },
    {
      name: 'Get One',
      value: 'getOne',
      action: 'Get one alert history',
    },
  ],
  default: 'getMany',
};

export const alertHistoryFields: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['alertHistory'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 10000 },
    default: 100,
    displayOptions: {
      show: {
        resource: ['alertHistory'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
  },
  {
    displayName: 'Detected Time Preset',
    name: 'detectedTimePreset',
    type: 'options',
    default: 'LAST_7_DAYS',
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
    description: 'Quickly select detected time range; choose Custom to enter specific values below',
    displayOptions: { show: { resource: ['alertHistory'], operation: ['getMany'] } },
  },
  {
    displayName: 'Tenants',
    name: 'tenants',
    type: 'multiOptions',
    typeOptions: {
      loadOptionsMethod: 'getTenants',
    },
    default: [],
    description: 'Select one or more tenants to query',
    displayOptions: {
      show: {
        resource: ['alertHistory'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Severity',
    name: 'filterSeverity',
    type: 'options',
    options: [
      { name: 'Unknown', value: 'unknown' },
      { name: 'Emergency', value: 'emergency' },
      { name: 'Critical', value: 'critical' },
      { name: 'Warning', value: 'warning' },
      { name: 'Info', value: 'info' },
    ],
    default: 'warning',
    displayOptions: {
      show: {
        resource: ['alertHistory'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Status',
    name: 'filterStatus',
    type: 'options',
    options: [
      { name: 'Created', value: 'created' },
      { name: 'Resolved', value: 'resolved' },
      { name: 'Paused', value: 'paused' },
      { name: 'Unpaused', value: 'unpaused' },
    ],
    default: 'created',
    displayOptions: {
      show: {
        resource: ['alertHistory'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Entity ID',
    name: 'filterEntityId',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['alertHistory'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Dismissed',
    name: 'filterDismissed',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['alertHistory'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Dispatched',
    name: 'filterDispatched',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['alertHistory'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Detected After',
    name: 'filterDetectedTimeAfter',
    type: 'string',
    default: '',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    description: 'Lower bound of detected time',
    displayOptions: {
      show: {
        resource: ['alertHistory'],
        operation: ['getMany'],
        detectedTimePreset: ['CUSTOM'],
      },
    },
  },
  {
    displayName: 'Detected Before',
    name: 'filterDetectedTimeBefore',
    type: 'string',
    default: '',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    description: 'Upper bound of detected time',
    displayOptions: {
      show: {
        resource: ['alertHistory'],
        operation: ['getMany'],
        detectedTimePreset: ['CUSTOM'],
      },
    },
  },
  {
    displayName: 'Alert ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['alertHistory'],
        operation: ['getOne'],
      },
    },
  },
];


