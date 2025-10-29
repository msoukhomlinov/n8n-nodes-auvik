import type { INodeProperties } from 'n8n-workflow';
import { dateTimePresetOptions } from '../../helpers/options/datePresets';

export const entityOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['entity'] } },
  options: [
    { name: 'Get Many Audits', value: 'getManyAudits', action: 'Get many entity audits' },
    { name: 'Get One Audit', value: 'getOneAudit', action: 'Get one entity audit' },
    { name: 'Get Many Notes', value: 'getManyNotes', action: 'Get many entity notes' },
    { name: 'Get One Note', value: 'getOneNote', action: 'Get one entity note' },
  ],
  default: 'getManyAudits',
};

export const entityFields: INodeProperties[] = [
  // Common list controls
  { displayName: 'Return All', name: 'returnAll', type: 'boolean', default: true, displayOptions: { show: { resource: ['entity'], operation: ['getManyAudits', 'getManyNotes'] } } },
  { displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1, maxValue: 10000 }, default: 100, displayOptions: { show: { resource: ['entity'], operation: ['getManyAudits', 'getManyNotes'], returnAll: [false] } } },

  // Audits filters
  { displayName: 'User', name: 'filterUser', type: 'string', default: '', displayOptions: { show: { resource: ['entity'], operation: ['getManyAudits'] } } },
  { displayName: 'Category', name: 'filterCategory', type: 'options', options: [{ name: 'Any', value: '' }, { name: 'Unknown', value: 'unknown' }, { name: 'Tunnel', value: 'tunnel' }, { name: 'Terminal', value: 'terminal' }, { name: 'Remote Browser', value: 'remoteBrowser' }], default: '', displayOptions: { show: { resource: ['entity'], operation: ['getManyAudits'] } } },
  { displayName: 'Status', name: 'filterStatus', type: 'options', options: [{ name: 'Any', value: '' }, { name: 'Unknown', value: 'unknown' }, { name: 'Initiated', value: 'initiated' }, { name: 'Created', value: 'created' }, { name: 'Closed', value: 'closed' }, { name: 'Failed', value: 'failed' }], default: '', displayOptions: { show: { resource: ['entity'], operation: ['getManyAudits'] } } },
  {
    displayName: 'Modified After Preset',
    name: 'modifiedAfterPreset',
    type: 'options',
    default: 'LAST_7_DAYS',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }],
    description: 'Quickly set the lower bound for modified time; choose Custom to enter a datetime',
    displayOptions: { show: { resource: ['entity'], operation: ['getManyAudits'] } },
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
        resource: ['entity'],
        operation: ['getManyAudits'],
        modifiedAfterPreset: ['CUSTOM'],
      },
    },
  },
  { displayName: 'Tenants', name: 'tenants', type: 'multiOptions', typeOptions: { loadOptionsMethod: 'getTenants' }, default: [], displayOptions: { show: { resource: ['entity'], operation: ['getManyAudits'] } } },

  // Notes filters
  { displayName: 'Entity ID', name: 'filterEntityId', type: 'string', default: '', displayOptions: { show: { resource: ['entity'], operation: ['getManyNotes'] } } },
  { displayName: 'Entity Type', name: 'filterEntityType', type: 'options', options: [{ name: 'Any', value: '' }, { name: 'Root', value: 'root' }, { name: 'Device', value: 'device' }, { name: 'Network', value: 'network' }, { name: 'Interface', value: 'interface' }], default: '', displayOptions: { show: { resource: ['entity'], operation: ['getManyNotes'] } } },
  { displayName: 'Entity Name', name: 'filterEntityName', type: 'string', default: '', displayOptions: { show: { resource: ['entity'], operation: ['getManyNotes'] } } },
  { displayName: 'Last Modified By', name: 'filterLastModifiedBy', type: 'string', default: '', displayOptions: { show: { resource: ['entity'], operation: ['getManyNotes'] } } },
  {
    displayName: 'Modified After Preset',
    name: 'notesModifiedAfterPreset',
    type: 'options',
    default: 'LAST_7_DAYS',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }],
    description: 'Quickly set the lower bound for modified time; choose Custom to enter a datetime',
    displayOptions: { show: { resource: ['entity'], operation: ['getManyNotes'] } },
  },
  {
    displayName: 'Modified After',
    name: 'filterNotesModifiedAfter',
    type: 'string',
    default: '',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    description: 'Lower bound of modified time (ISO 8601 UTC)',
    displayOptions: {
      show: {
        resource: ['entity'],
        operation: ['getManyNotes'],
        notesModifiedAfterPreset: ['CUSTOM'],
      },
    },
  },
  { displayName: 'Tenants', name: 'tenantsNotes', type: 'multiOptions', typeOptions: { loadOptionsMethod: 'getTenants' }, default: [], displayOptions: { show: { resource: ['entity'], operation: ['getManyNotes'] } } },

  // Single IDs
  { displayName: 'Audit ID', name: 'auditId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['entity'], operation: ['getOneAudit'] } } },
  { displayName: 'Note ID', name: 'noteId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['entity'], operation: ['getOneNote'] } } },
];


