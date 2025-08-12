import type { INodeProperties } from 'n8n-workflow';

export const networkOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['network'],
    },
  },
  options: [
    {
      name: 'Get Many',
      value: 'getMany',
      action: 'Get many networks info',
    },
    {
      name: 'Get One',
      value: 'getOne',
      action: 'Get one network info',
    },
  ],
  default: 'getMany',
};

export const networkFields: INodeProperties[] = [
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['network'],
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
        resource: ['network'],
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
        resource: ['network'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Network Type',
    name: 'filterNetworkType',
    type: 'options',
    options: [
      { name: 'Routed', value: 'routed' },
      { name: 'VLAN', value: 'vlan' },
      { name: 'WiFi', value: 'wifi' },
      { name: 'Loopback', value: 'loopback' },
      { name: 'Network', value: 'network' },
      { name: 'Layer 2', value: 'layer2' },
      { name: 'Internet', value: 'internet' },
    ],
    default: 'routed',
    displayOptions: {
      show: {
        resource: ['network'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Scan Status',
    name: 'filterScanStatus',
    type: 'options',
    options: [
      { name: 'True', value: 'true' },
      { name: 'False', value: 'false' },
      { name: 'Not Allowed', value: 'notAllowed' },
      { name: 'Unknown', value: 'unknown' },
    ],
    default: 'true',
    displayOptions: {
      show: {
        resource: ['network'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Devices',
    name: 'filterDevices',
    type: 'string',
    default: '',
    description: 'Comma-delimited device IDs on this network',
    displayOptions: {
      show: {
        resource: ['network'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Modified After',
    name: 'filterModifiedAfter',
    type: 'string',
    default: '',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    displayOptions: {
      show: {
        resource: ['network'],
        operation: ['getMany'],
      },
    },
  },
  {
    displayName: 'Include Network Detail',
    name: 'includeNetworkDetail',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['network'],
        operation: ['getMany', 'getOne'],
      },
    },
  },
  {
    displayName: 'Network Detail Fields',
    name: 'fieldsNetworkDetail',
    type: 'multiOptions',
    options: [
      { name: 'scope', value: 'scope' },
      { name: 'primaryCollector', value: 'primaryCollector' },
      { name: 'secondaryCollectors', value: 'secondaryCollectors' },
      { name: 'collectorSelection', value: 'collectorSelection' },
      { name: 'excludedIpAddresses', value: 'excludedIpAddresses' },
    ],
    default: [],
    description: 'Requires include=networkDetail',
    displayOptions: {
      show: {
        resource: ['network'],
        operation: ['getMany', 'getOne'],
        includeNetworkDetail: [true],
      },
    },
  },
  {
    displayName: 'Network ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['network'],
        operation: ['getOne'],
      },
    },
  },
];


