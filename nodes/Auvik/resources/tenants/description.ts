import type { INodeProperties } from 'n8n-workflow';

export const tenantOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['tenant'],
    },
  },
  options: [
    {
      name: 'Get Many',
      value: 'getMany',
      action: 'Get many tenants',
      description: 'Read multiple tenants',
    },
    {
      name: 'Get Many Detail',
      value: 'getManyDetail',
      action: 'Get many tenants detail',
      description: 'Read multiple tenants detail',
    },
    {
      name: 'Get One Detail',
      value: 'getOneDetail',
      action: 'Get one tenant detail',
      description: 'Read a single tenant detail by ID',
    },
  ],
  default: 'getMany',
};

export const tenantFields: INodeProperties[] = [
  // List common controls
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: {
      show: {
        resource: ['tenant'],
        operation: ['getMany', 'getManyDetail'],
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
        resource: ['tenant'],
        operation: ['getMany', 'getManyDetail'],
        returnAll: [false],
      },
    },
  },
  // Tenants detail collection requires domain prefix and supports availableTenants filter
  {
    displayName: 'Tenant Domain Prefix',
    name: 'tenantDomainPrefix',
    type: 'string',
    required: true,
    default: '',
    description: 'Domain prefix of your main Auvik account',
    displayOptions: {
      show: {
        resource: ['tenant'],
        operation: ['getManyDetail', 'getOneDetail'],
      },
    },
  },
  {
    displayName: 'Only Available Tenants',
    name: 'filterAvailableTenants',
    type: 'boolean',
    default: false,
    description:
      'If true, only tenants that are available for API access will be returned (filter[availableTenants]=true)',
    displayOptions: {
      show: {
        resource: ['tenant'],
        operation: ['getManyDetail'],
      },
    },
  },
  // Single detail by ID
  {
    displayName: 'Tenant ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    description: 'ID of the tenant to retrieve',
    displayOptions: {
      show: {
        resource: ['tenant'],
        operation: ['getOneDetail'],
      },
    },
  },
];


