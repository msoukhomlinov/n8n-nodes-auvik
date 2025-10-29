import type { INodeProperties } from 'n8n-workflow';
import { dateTimePresetOptions } from '../../helpers/options/datePresets';

export const asmOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['asm'] } },
  options: [
    { name: 'Get Apps', value: 'getApps', action: 'Get ASM apps' },
    { name: 'Get Clients', value: 'getClients', action: 'Get ASM clients' },
    { name: 'Get Licenses', value: 'getLicenses', action: 'Get ASM licenses' },
    { name: 'Get Security Logs', value: 'getSecurityLogs', action: 'Get ASM security logs' },
    { name: 'Get Tags', value: 'getTags', action: 'Get ASM tags' },
    { name: 'Get Users', value: 'getUsers', action: 'Get ASM users' },
  ],
  default: 'getApps',
};

export const asmFields: INodeProperties[] = [
  // Required Client ID for most operations
  {
    displayName: 'Client ID',
    name: 'clientId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getApps', 'getSecurityLogs', 'getTags', 'getUsers', 'getLicenses']
      }
    }
  },

  // Apps-specific filters
  {
    displayName: 'Query Date Preset',
    name: 'queryDatePreset',
    type: 'options',
    default: 'LAST_30_DAYS',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }],
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getApps', 'getClients', 'getSecurityLogs']
      }
    }
  },
  {
    displayName: 'Query Date',
    name: 'queryDate',
    type: 'string',
    default: '',
    description: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getApps', 'getClients', 'getSecurityLogs'],
        queryDatePreset: ['CUSTOM']
      }
    }
  },

  // Apps date filters
  {
    displayName: 'Date Added After Preset',
    name: 'dateAddedAfterPreset',
    type: 'options',
    default: 'NONE',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }, { name: 'None', value: 'NONE' }],
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getApps']
      }
    }
  },
  {
    displayName: 'Date Added After',
    name: 'dateAddedAfter',
    type: 'string',
    default: '',
    description: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getApps'],
        dateAddedAfterPreset: ['CUSTOM']
      }
    }
  },
  {
    displayName: 'Date Added Before Preset',
    name: 'dateAddedBeforePreset',
    type: 'options',
    default: 'NONE',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }, { name: 'None', value: 'NONE' }],
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getApps']
      }
    }
  },
  {
    displayName: 'Date Added Before',
    name: 'dateAddedBefore',
    type: 'string',
    default: '',
    description: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getApps'],
        dateAddedBeforePreset: ['CUSTOM']
      }
    }
  },
  {
    displayName: 'User Last Used After Preset',
    name: 'userLastUsedAfterPreset',
    type: 'options',
    default: 'NONE',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }, { name: 'None', value: 'NONE' }],
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getApps']
      }
    }
  },
  {
    displayName: 'User Last Used After',
    name: 'userLastUsedAfter',
    type: 'string',
    default: '',
    description: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getApps'],
        userLastUsedAfterPreset: ['CUSTOM']
      }
    }
  },
  {
    displayName: 'User Last Used Before Preset',
    name: 'userLastUsedBeforePreset',
    type: 'options',
    default: 'NONE',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }, { name: 'None', value: 'NONE' }],
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getApps']
      }
    }
  },
  {
    displayName: 'User Last Used Before',
    name: 'userLastUsedBefore',
    type: 'string',
    default: '',
    description: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getApps'],
        userLastUsedBeforePreset: ['CUSTOM']
      }
    }
  },

  // Include parameters with proper enums
  {
    displayName: 'Include',
    name: 'include',
    type: 'multiOptions',
    default: [],
    options: [
      { name: 'All', value: 'all' },
      { name: 'Breaches', value: 'breaches' },
      { name: 'Users', value: 'users' },
      { name: 'Contracts', value: 'contracts' },
      { name: 'Publisher', value: 'publisher' },
      { name: 'Access Data', value: 'accessData' }
    ],
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getApps']
      }
    }
  },
  {
    displayName: 'Include',
    name: 'include',
    type: 'options',
    default: '',
    options: [
      { name: 'None', value: '' },
      { name: 'Totals', value: 'totals' }
    ],
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getClients']
      }
    }
  },
  {
    displayName: 'Include',
    name: 'include',
    type: 'multiOptions',
    default: [],
    options: [
      { name: 'Users', value: 'users' },
      { name: 'Applications', value: 'applications' }
    ],
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getSecurityLogs']
      }
    }
  },

  // License-specific fields
  {
    displayName: 'Application ID',
    name: 'applicationId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getLicenses']
      }
    }
  },
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getLicenses']
      }
    }
  },
  {
    displayName: 'License Type',
    name: 'licenseType',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getLicenses']
      }
    }
  },
  {
    displayName: 'Last Login Before Preset',
    name: 'lastLoginBeforePreset',
    type: 'options',
    default: 'NONE',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }, { name: 'None', value: 'NONE' }],
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getLicenses']
      }
    }
  },
  {
    displayName: 'Last Login Before',
    name: 'lastLoginBefore',
    type: 'string',
    default: '',
    description: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getLicenses'],
        lastLoginBeforePreset: ['CUSTOM']
      }
    }
  },
  {
    displayName: 'Underutilized Only',
    name: 'underutilizedOnly',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getLicenses']
      }
    }
  },

  // Tags-specific field
  {
    displayName: 'Application ID',
    name: 'applicationId',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['asm'],
        operation: ['getTags']
      }
    }
  },
];


