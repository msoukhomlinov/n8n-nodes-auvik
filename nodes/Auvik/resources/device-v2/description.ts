import type { INodeProperties } from 'n8n-workflow';
import { dateTimePresetOptions } from '../../helpers/options/datePresets';

export const deviceV2Operations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['deviceV2'],
    },
  },
  options: [
    {
      name: 'Get Many',
      value: 'getMany',
      action: 'Get many devices info',
      description: 'Read multiple devices\' info (V2 Beta)',
    },
    {
      name: 'Get One',
      value: 'getOne',
      action: 'Get one device info',
      description: 'Read a single device\'s info by ID (V2 Beta)',
    },
  ],
  default: 'getMany',
};

export const deviceV2Fields: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['deviceV2'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 10000 },
    default: 1000,
    description: 'Maximum number of results to return (V2 default: 1000, max: 10000)',
    displayOptions: {
      show: {
        resource: ['deviceV2'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
  },
  {
    displayName: 'Tenant',
    name: 'tenant',
    type: 'options',
    typeOptions: {
      loadOptionsMethod: 'getTenants',
    },
    default: '',
    description: 'Select a tenant to query. Child tenants are automatically included in the response.',
    displayOptions: {
      show: {
        resource: ['deviceV2'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Device Type',
    name: 'filterDeviceType',
    type: 'options',
    options: [
      { name: '— Any —', value: '' },
      { name: 'Access Point', value: 'accessPoint' },
      { name: 'Air Conditioner', value: 'airConditioner' },
      { name: 'Alarm', value: 'alarm' },
      { name: 'Audio Visual', value: 'audioVisual' },
      { name: 'Backhaul', value: 'backhaul' },
      { name: 'Backup Device', value: 'backupDevice' },
      { name: 'Bridge', value: 'bridge' },
      { name: 'Building Management', value: 'buildingManagement' },
      { name: 'Camera', value: 'camera' },
      { name: 'Chassis', value: 'chassis' },
      { name: 'Controller', value: 'controller' },
      { name: 'Copier', value: 'copier' },
      { name: 'Firewall', value: 'firewall' },
      { name: 'Handheld', value: 'handheld' },
      { name: 'Hub', value: 'hub' },
      { name: 'Hypervisor', value: 'hypervisor' },
      { name: 'Internet of Things', value: 'internetOfThings' },
      { name: 'IP Phone', value: 'ipPhone' },
      { name: 'IPMI', value: 'ipmi' },
      { name: 'Layer 3 Switch', value: 'l3Switch' },
      { name: 'Lighting Device', value: 'lightingDevice' },
      { name: 'Load Balancer', value: 'loadBalancer' },
      { name: 'Modem', value: 'modem' },
      { name: 'Module', value: 'module' },
      { name: 'Multimedia', value: 'multimedia' },
      { name: 'Packet Processor', value: 'packetProcessor' },
      { name: 'PDU', value: 'pdu' },
      { name: 'Phone', value: 'phone' },
      { name: 'Printer', value: 'printer' },
      { name: 'Router', value: 'router' },
      { name: 'Security Appliance', value: 'securityAppliance' },
      { name: 'Server', value: 'server' },
      { name: 'Stack', value: 'stack' },
      { name: 'Storage', value: 'storage' },
      { name: 'Switch', value: 'switch' },
      { name: 'Tablet', value: 'tablet' },
      { name: 'Telecommunications', value: 'telecommunications' },
      { name: 'Thin Access Point', value: 'thinAccessPoint' },
      { name: 'Thin Client', value: 'thinClient' },
      { name: 'Time Clock', value: 'timeClock' },
      { name: 'Unknown', value: 'unknown' },
      { name: 'UPS', value: 'ups' },
      { name: 'UTM', value: 'utm' },
      { name: 'Virtual Appliance', value: 'virtualAppliance' },
      { name: 'Virtual Machine', value: 'virtualMachine' },
      { name: 'VoIP Switch', value: 'voipSwitch' },
      { name: 'Workstation', value: 'workstation' },
    ],
    default: '',
    displayOptions: {
      show: {
        resource: ['deviceV2'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Make',
    name: 'filterMake',
    type: 'string',
    default: '',
    description: 'Filter by device make (e.g., Cisco, HP, Dell)',
    displayOptions: {
      show: {
        resource: ['deviceV2'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Model',
    name: 'filterModel',
    type: 'string',
    default: '',
    description: 'Filter by device model',
    displayOptions: {
      show: {
        resource: ['deviceV2'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Make & Model',
    name: 'filterMakeModel',
    type: 'string',
    default: '',
    description: 'Filter by device make and model combined (e.g., "Cisco AIR-CAP2700-A-K9")',
    displayOptions: {
      show: {
        resource: ['deviceV2'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Online Status',
    name: 'filterOnlineStatus',
    type: 'options',
    options: [
      { name: '— Any —', value: '' },
      { name: 'Dormant', value: 'dormant' },
      { name: 'Lower Layer Down', value: 'lowerLayerDown' },
      { name: 'Not Present', value: 'notPresent' },
      { name: 'Offline', value: 'offline' },
      { name: 'Online', value: 'online' },
      { name: 'Testing', value: 'testing' },
      { name: 'Unknown', value: 'unknown' },
      { name: 'Unreachable', value: 'unreachable' },
    ],
    default: '',
    displayOptions: {
      show: {
        resource: ['deviceV2'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Managed Status',
    name: 'filterManageStatus',
    type: 'options',
    options: [
      { name: '— Any —', value: '' },
      { name: 'Managed', value: 'true' },
      { name: 'Unmanaged', value: 'false' },
    ],
    default: '',
    description: 'Whether the device is managed by Auvik',
    displayOptions: {
      show: {
        resource: ['deviceV2'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Networks',
    name: 'filterNetworks',
    type: 'multiOptions',
    typeOptions: {
      loadOptionsMethod: 'getNetworksByTenant',
    },
    default: [],
    description: 'Filter by network IDs',
    displayOptions: {
      show: {
        resource: ['deviceV2'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Not Seen Since',
    name: 'filterNotSeenSince',
    type: 'dateTime',
    default: '',
    description: 'Filter by last seen online time, returning devices not seen online after the provided value',
    displayOptions: {
      show: {
        resource: ['deviceV2'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Not Seen Since Preset',
    name: 'filterNotSeenSincePreset',
    type: 'options',
    options: dateTimePresetOptions,
    default: 'NO_FILTER',
    description: 'Quick preset for Not Seen Since filter',
    displayOptions: {
      show: {
        resource: ['deviceV2'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Device ID',
    name: 'deviceId',
    type: 'string',
    default: '',
    required: true,
    description: 'The ID of the device to retrieve',
    displayOptions: {
      show: {
        resource: ['deviceV2'],
        operation: ['getOne'],
      },
    },
  },
];
