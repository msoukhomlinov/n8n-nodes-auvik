import type { INodeProperties } from 'n8n-workflow';
import { dateTimePresetOptions } from '../../helpers/options/datePresets';

export const interfaceOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['interface'],
    },
  },
  options: [
    {
      name: 'Get Many',
      value: 'getMany',
      action: 'Get many interfaces info',
    },
    {
      name: 'Get One',
      value: 'getOne',
      action: 'Get one interface info',
    },
  ],
  default: 'getMany',
};

export const interfaceFields: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['interface'],
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
        resource: ['interface'],
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
        resource: ['interface'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Interface Type',
    name: 'filterInterfaceType',
    type: 'options',
    options: [
      { name: 'Ethernet', value: 'ethernet' },
      { name: 'WiFi', value: 'wifi' },
      { name: 'VLAN', value: 'vlan' },
      { name: 'Loopback', value: 'loopback' },
      { name: 'Tunnel', value: 'tunnel' },
      { name: 'Virtual', value: 'virtual' },
      { name: 'USB', value: 'usb' },
      { name: 'Other', value: 'other' },
    ],
    default: 'ethernet',
    description: 'Filter by interface type',
    displayOptions: {
      show: {
        resource: ['interface'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Parent Device ID',
    name: 'filterParentDevice',
    type: 'string',
    default: '',
    description: 'Filter by parent device ID',
    displayOptions: {
      show: {
        resource: ['interface'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Admin Status',
    name: 'filterAdminStatus',
    type: 'boolean',
    default: false,
    description: "Filter by the interface’s admin status",
    displayOptions: {
      show: {
        resource: ['interface'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Operational Status',
    name: 'filterOperationalStatus',
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
    displayOptions: {
      show: {
        resource: ['interface'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Modified After Preset',
    name: 'modifiedAfterPreset',
    type: 'options',
    default: 'LAST_7_DAYS',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }],
    displayOptions: { show: { resource: ['interface'], operation: ['getMany'] } },
  },
  {
    displayName: 'Modified After',
    name: 'filterModifiedAfter',
    type: 'string',
    default: '',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    description: 'Lower bound of modified time (ISO 8601 UTC)',
    displayOptions: {
      show: {
        resource: ['interface'],
        operation: ['getMany'],
        modifiedAfterPreset: ['CUSTOM'],
      },
    },
  },
  {
    displayName: 'Interface ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['interface'],
        operation: ['getOne'],
      },
    },
  },
];


