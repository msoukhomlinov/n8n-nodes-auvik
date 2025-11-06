import type { INodeProperties } from 'n8n-workflow';
import { dateTimePresetOptions } from '../../helpers/options/datePresets';

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
    description: 'Filter by device type',
    displayOptions: {
      show: {
        resource: ['device'],
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
    description: 'Filter by IDs of networks this device is on',
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
    description: 'Filter by the device\'s make and model',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Device Name',
    name: 'filterDeviceName',
    type: 'string',
    default: '',
    description: 'Filter by device name (client-side filtering)',
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
    description: 'Filter by the device\'s online status',
    displayOptions: {
      show: {
        resource: ['device'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'TrafficInsights Status',
    name: 'filterTrafficInsightsStatus',
    type: 'options',
    options: [
      { name: '— Any —', value: '' },
      { name: 'Approved', value: 'approved' },
      { name: 'Detected', value: 'detected' },
      { name: 'Forwarding', value: 'forwarding' },
      { name: 'Linking', value: 'linking' },
      { name: 'Linking Failed', value: 'linkingFailed' },
      { name: 'Not Approved', value: 'notApproved' },
      { name: 'Not Detected', value: 'notDetected' },
    ],
    default: '',
    description: 'Filter by the device\'s TrafficInsights status',
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
    default: 'NO_FILTER',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }],
    description: 'Quickly set the lower bound for modified time; choose Custom to enter a datetime',
    displayOptions: { show: { resource: ['device'], operation: ['getMany'] } },
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
    default: 'NO_FILTER',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }],
    description: 'Quickly set the lower bound for last seen time; choose Custom to enter a datetime',
    displayOptions: { show: { resource: ['device'], operation: ['getMany'] } },
  },
  {
    displayName: 'Not Seen Since',
    name: 'filterNotSeenSince',
    type: 'string',
    default: '',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    description: 'Lower bound of last seen online time (ISO 8601 UTC)',
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
      { name: 'trafficInsightsStatus', value: 'trafficInsightsStatus' },
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

