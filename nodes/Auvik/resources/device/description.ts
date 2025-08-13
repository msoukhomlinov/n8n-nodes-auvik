import type { INodeProperties } from 'n8n-workflow';

export const deviceOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['device'],
    },
  },
  options: [
    {
      name: 'Get Many',
      value: 'getMany',
      action: 'Get many devices info',
      description: 'Read multiple devices’ info',
    },
    {
      name: 'Get One',
      value: 'getOne',
      action: 'Get one device info',
      description: 'Read a single device’s info by ID',
    },
  ],
  default: 'getMany',
};

export const deviceFields: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['device'],
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
        resource: ['device'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
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
        resource: ['device'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Device Type',
    name: 'filterDeviceType',
    type: 'options',
    options: [
      { name: 'Router', value: 'router' },
      { name: 'Switch', value: 'switch' },
      { name: 'Access Point', value: 'accessPoint' },
      { name: 'Firewall', value: 'firewall' },
      { name: 'Server', value: 'server' },
      { name: 'Workstation', value: 'workstation' },
      { name: 'Printer', value: 'printer' },
      { name: 'Hypervisor', value: 'hypervisor' },
      { name: 'Storage', value: 'storage' },
      { name: 'VoIP', value: 'voip' },
      { name: 'Phone', value: 'phone' },
      { name: 'Other', value: 'other' },
    ],
    default: 'router',
    description: 'Filter by device type',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Vendor Name',
    name: 'filterVendorName',
    type: 'string',
    default: '',
    description: 'Filter by vendor/manufacturer name',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Make and Model',
    name: 'filterMakeModel',
    type: 'string',
    default: '',
    description: 'Filter by the device’s make and model',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Online Status',
    name: 'filterOnlineStatus',
    type: 'options',
    options: [
      { name: 'Online', value: 'online' },
      { name: 'Offline', value: 'offline' },
      { name: 'Unreachable', value: 'unreachable' },
      { name: 'Testing', value: 'testing' },
      { name: 'Unknown', value: 'unknown' },
      { name: 'Dormant', value: 'dormant' },
      { name: 'Not Present', value: 'notPresent' },
      { name: 'Lower Layer Down', value: 'lowerLayerDown' },
    ],
    default: 'online',
    description: 'Filter by the device’s online status',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Modified After Preset',
    name: 'modifiedAfterPreset',
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
    description: 'Quickly set the lower bound for modified time; choose Custom to enter a datetime',
    displayOptions: { show: { resource: ['device'], operation: ['getMany'] } },
  },
  {
    displayName: 'Modified After',
    name: 'filterModifiedAfter',
    type: 'string',
    default: '',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    description: 'Filter by entities modified after provided value',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getMany'],
        modifiedAfterPreset: ['CUSTOM'],
      },
    },
  },
  {
    displayName: 'Not Seen Since Preset',
    name: 'notSeenSincePreset',
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
    description: 'Quickly set the lower bound for last seen time; choose Custom to enter a datetime',
    displayOptions: { show: { resource: ['device'], operation: ['getMany'] } },
  },
  {
    displayName: 'Not Seen Since',
    name: 'filterNotSeenSince',
    type: 'string',
    default: '',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    description: 'Filter by last seen online time',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getMany'],
        notSeenSincePreset: ['CUSTOM'],
      },
    },
  },
  {
    displayName: 'State Known',
    name: 'filterStateKnown',
    type: 'boolean',
    default: false,
    description: 'Only devices with recently updated data',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Include Device Detail',
    name: 'includeDeviceDetail',
    type: 'boolean',
    default: false,
    description: 'Include deviceDetail relationship',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getMany', 'getOne'],
      },
    },
  },
  {
    displayName: 'Device Detail Fields',
    name: 'fieldsDeviceDetail',
    type: 'multiOptions',
    options: [
      { name: 'discoveryStatus', value: 'discoveryStatus' },
      { name: 'components', value: 'components' },
      { name: 'connectedDevices', value: 'connectedDevices' },
      { name: 'configurations', value: 'configurations' },
      { name: 'manageStatus', value: 'manageStatus' },
      { name: 'interfaces', value: 'interfaces' },
    ],
    default: [],
    description: 'Requires include=deviceDetail',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getMany', 'getOne'],
        includeDeviceDetail: [true],
      },
    },
  },
  {
    displayName: 'Device ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getOne'],
      },
    },
  },
];

