import type { INodeProperties } from 'n8n-workflow';
import { dateTimePresetOptions } from '../../helpers/options/datePresets';

export const playbookOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['playbook'] } },
  options: [
    { name: 'Triage Alerts', value: 'triageAlerts', action: 'List and optionally dismiss alerts with context' },
    { name: 'Health Snapshot', value: 'healthSnapshot', action: 'Summarise devices, interfaces, alerts, ASM' },
    { name: 'Search Entities', value: 'searchEntities', action: 'Search devices/components/interfaces' },
  ],
  default: 'triageAlerts',
};

export const playbookFields: INodeProperties[] = [
  // Common tenant selector
  {
    displayName: 'Tenants',
    name: 'tenants',
    type: 'multiOptions',
    typeOptions: { loadOptionsMethod: 'getTenants' },
    default: [],
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts', 'healthSnapshot', 'searchEntities'] } },
  },

  // Triage Alerts options
  {
    displayName: 'Severity',
    name: 'severity',
    type: 'options',
    options: [
      { name: 'Any', value: '' },
      { name: 'Emergency', value: 'emergency' },
      { name: 'Critical', value: 'critical' },
      { name: 'Warning', value: 'warning' },
      { name: 'Info', value: 'info' },
    ],
    default: '',
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'] } },
  },
  {
    displayName: 'Detected Time Preset',
    name: 'detectedTimePreset',
    type: 'options',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }],
    default: 'LAST_7_DAYS',
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'] } },
  },
  {
    displayName: 'Detected After',
    name: 'filterDetectedTimeAfter',
    type: 'string',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    default: '',
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'], detectedTimePreset: ['CUSTOM'] } },
  },
  {
    displayName: 'Detected Before',
    name: 'filterDetectedTimeBefore',
    type: 'string',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    default: '',
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'], detectedTimePreset: ['CUSTOM'] } },
  },
  {
    displayName: 'Include Recent Utilisation',
    name: 'includeUtilisation',
    type: 'boolean',
    default: true,
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'] } },
  },
  {
    displayName: 'Include Last Configuration',
    name: 'includeLastConfig',
    type: 'boolean',
    default: true,
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'] } },
  },
  {
    displayName: 'Utilisation Window (hours)',
    name: 'utilisationWindowHours',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 168 },
    default: 24,
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'], includeUtilisation: [true] } },
  },
  {
    displayName: 'Bulk Dismiss',
    name: 'bulkDismiss',
    type: 'boolean',
    default: false,
    description: 'Warning: This will make changes by calling POST /alert/dismiss/{id} for each matching alert.',
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'] } },
  },
  {
    displayName: 'Confirm Bulk Dismiss',
    name: 'confirmBulkDismiss',
    type: 'boolean',
    default: false,
    description: 'Tick to confirm you understand this will dismiss alerts in Auvik.',
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'], bulkDismiss: [true] } },
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: true,
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'] } },
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 10000 },
    default: 100,
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'], returnAll: [false] } },
  },

  // Health Snapshot options
  {
    displayName: 'Severity Threshold',
    name: 'severityThreshold',
    type: 'options',
    options: [
      { name: 'Critical+', value: 'critical' },
      { name: 'Warning+', value: 'warning' },
      { name: 'Any', value: '' },
    ],
    default: 'critical',
    displayOptions: { show: { resource: ['playbook'], operation: ['healthSnapshot'] } },
  },
  {
    displayName: 'Lookback Preset',
    name: 'snapshotPreset',
    type: 'options',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }],
    default: 'LAST_7_DAYS',
    displayOptions: { show: { resource: ['playbook'], operation: ['healthSnapshot'] } },
  },
  {
    displayName: 'From Time',
    name: 'snapshotFrom',
    type: 'string',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    default: '',
    displayOptions: { show: { resource: ['playbook'], operation: ['healthSnapshot'], snapshotPreset: ['CUSTOM'] } },
  },
  {
    displayName: 'To Time',
    name: 'snapshotTo',
    type: 'string',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
    default: '',
    displayOptions: { show: { resource: ['playbook'], operation: ['healthSnapshot'], snapshotPreset: ['CUSTOM'] } },
  },
  {
    displayName: 'Include Detailed Lists',
    name: 'includeLists',
    type: 'boolean',
    default: false,
    description: 'When off, returns only counts and summaries; when on, includes full entity lists',
    displayOptions: { show: { resource: ['playbook'], operation: ['healthSnapshot'] } },
  },

  // Search Entities options
  {
    displayName: 'Query',
    name: 'query',
    type: 'string',
    required: true,
    default: '',
    description: 'Text to match in names/addresses (client-side contains match)',
    displayOptions: { show: { resource: ['playbook'], operation: ['searchEntities'] } },
  },
  {
    displayName: 'Scope',
    name: 'scope',
    type: 'multiOptions',
    options: [
      { name: 'Devices', value: 'device' },
      { name: 'Interfaces', value: 'interface' },
      { name: 'Components', value: 'component' },
    ],
    default: ['device', 'interface', 'component'],
    displayOptions: { show: { resource: ['playbook'], operation: ['searchEntities'] } },
  },
  {
    displayName: 'Max Results',
    name: 'maxResults',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 10000 },
    default: 200,
    displayOptions: { show: { resource: ['playbook'], operation: ['searchEntities'] } },
  },

];


