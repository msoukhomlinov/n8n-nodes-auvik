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
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts', 'healthSnapshot'] } },
  },

  // Triage Alerts options
  {
    displayName: 'Severity',
    name: 'severity',
    type: 'options',
    options: [
      { name: 'Any', value: '' },
      { name: 'Critical', value: 'critical' },
      { name: 'Emergency', value: 'emergency' },
      { name: 'Info', value: 'info' },
      { name: 'Warning', value: 'warning' },
    ],
    default: '',
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'] } },
  },
  {
    displayName: 'Detected Time Preset',
    name: 'detectedTimePreset',
    type: 'options',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }],
    default: 'NO_FILTER',
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'] } },
  },
  {
    displayName: 'Detected After',
    name: 'filterDetectedTimeAfter',
    type: 'string',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    default: '',
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'], detectedTimePreset: ['CUSTOM'] } },
  },
  {
    displayName: 'Detected Before',
    name: 'filterDetectedTimeBefore',
    type: 'string',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
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
    displayName: 'Utilisation Preset',
    name: 'utilisationPreset',
    type: 'options',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }],
    default: 'NO_FILTER',
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'], includeUtilisation: [true] } },
  },
  {
    displayName: 'Utilisation Window',
    name: 'utilisationWindowHours',
    type: 'number',
    typeOptions: { minValue: 1, maxValue: 168 },
    default: 24,
    displayOptions: { show: { resource: ['playbook'], operation: ['triageAlerts'], includeUtilisation: [true], utilisationPreset: ['CUSTOM'] } },
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
      { name: 'Any', value: '' },
      { name: 'Critical+', value: 'critical' },
      { name: 'Warning+', value: 'warning' },
    ],
    default: 'critical',
    displayOptions: { show: { resource: ['playbook'], operation: ['healthSnapshot'] } },
  },
  {
    displayName: 'Lookback Preset',
    name: 'snapshotPreset',
    type: 'options',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }],
    default: 'NO_FILTER',
    displayOptions: { show: { resource: ['playbook'], operation: ['healthSnapshot'] } },
  },
  {
    displayName: 'From Time',
    name: 'snapshotFrom',
    type: 'string',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    default: '',
    displayOptions: { show: { resource: ['playbook'], operation: ['healthSnapshot'], snapshotPreset: ['CUSTOM'] } },
  },
  {
    displayName: 'To Time',
    name: 'snapshotTo',
    type: 'string',
    placeholder: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
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



];


