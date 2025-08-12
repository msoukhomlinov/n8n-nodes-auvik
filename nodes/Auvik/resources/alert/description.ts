import type { INodeProperties } from 'n8n-workflow';

export const alertOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['alert'],
    },
  },
  options: [
    {
      name: 'Dismiss',
      value: 'dismiss',
      action: 'Dismiss an alert',
      description: 'Dismiss an alert by ID',
    },
  ],
  default: 'dismiss',
};

export const alertFields: INodeProperties[] = [
  {
    displayName: 'Alert ID',
    name: 'id',
    type: 'string',
    required: true,
    default: '',
    description: 'ID of the alert to dismiss',
    displayOptions: {
      show: {
        resource: ['alert'],
        operation: ['dismiss'],
      },
    },
  },
];


