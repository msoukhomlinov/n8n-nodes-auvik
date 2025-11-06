import type { INodeProperties } from 'n8n-workflow';
import { dateTimePresetOptions } from '../../helpers/options/datePresets';

export const snmpOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['snmp'] } },
  options: [
    { name: 'Get Settings', value: 'getSettings', action: 'Get SNMP poller settings' },
    { name: 'Get Setting', value: 'getSetting', action: 'Get a SNMP poller setting' },
    { name: 'Get Setting Devices', value: 'getSettingDevices', action: 'Get SNMP poller setting devices' },
    { name: 'Get History (String)', value: 'getHistoryString', action: "Get SNMP poller string history" },
    { name: 'Get History (Numeric)', value: 'getHistoryNumeric', action: 'Get SNMP poller numeric history' },
  ],
  default: 'getSettings',
};

export const snmpFields: INodeProperties[] = [
  // Settings list
  { displayName: 'Tenants', name: 'tenants', type: 'multiOptions', typeOptions: { loadOptionsMethod: 'getTenants' }, required: true, default: [], displayOptions: { show: { resource: ['snmp'], operation: ['getSettings'] } } },
  { displayName: 'Device ID', name: 'filterDeviceId', type: 'string', default: '', displayOptions: { show: { resource: ['snmp'], operation: ['getSettings'] } } },
  { displayName: 'Use As', name: 'filterUseAs', type: 'options', options: [{ name: 'Serial No', value: 'serialNo' }, { name: 'Poller', value: 'poller' }], default: 'poller', displayOptions: { show: { resource: ['snmp'], operation: ['getSettings'] } } },
  { displayName: 'Type', name: 'filterType', type: 'options', options: [{ name: 'String', value: 'string' }, { name: 'Numeric', value: 'numeric' }], default: 'string', displayOptions: { show: { resource: ['snmp'], operation: ['getSettings'] } } },
  { displayName: 'Device Type', name: 'filterDeviceType', type: 'string', default: '', displayOptions: { show: { resource: ['snmp'], operation: ['getSettings'] } } },
  { displayName: 'Make Model', name: 'filterMakeModel', type: 'string', default: '', displayOptions: { show: { resource: ['snmp'], operation: ['getSettings'] } } },
  { displayName: 'Vendor Name', name: 'filterVendorName', type: 'string', default: '', displayOptions: { show: { resource: ['snmp'], operation: ['getSettings'] } } },
  { displayName: 'OID', name: 'filterOid', type: 'string', default: '', displayOptions: { show: { resource: ['snmp'], operation: ['getSettings'] } } },
  { displayName: 'Name', name: 'filterName', type: 'string', default: '', displayOptions: { show: { resource: ['snmp'], operation: ['getSettings'] } } },

  // Single setting and devices
  { displayName: 'Setting ID', name: 'snmpPollerSettingId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['snmp'], operation: ['getSetting', 'getSettingDevices'] } } },
  { displayName: 'Tenants', name: 'tenantsDevices', type: 'multiOptions', typeOptions: { loadOptionsMethod: 'getTenants' }, required: true, default: [], displayOptions: { show: { resource: ['snmp'], operation: ['getSettingDevices'] } } },
  { displayName: 'Online Status', name: 'filterOnlineStatus', type: 'options', options: [
    { name: 'Dormant', value: 'dormant' },
    { name: 'Lower Layer Down', value: 'lowerLayerDown' },
    { name: 'Not Present', value: 'notPresent' },
    { name: 'Offline', value: 'offline' },
    { name: 'Online', value: 'online' },
    { name: 'Testing', value: 'testing' },
    { name: 'Unknown', value: 'unknown' },
    { name: 'Unreachable', value: 'unreachable' },
  ], default: 'online', displayOptions: { show: { resource: ['snmp'], operation: ['getSettingDevices'] } } },
  {
    displayName: 'Modified After Preset',
    name: 'modifiedAfterPreset',
    type: 'options',
    default: 'NO_FILTER',
    options: [...dateTimePresetOptions, { name: 'Custom', value: 'CUSTOM' }],
    description: 'Quickly set the lower bound for modified time; choose Custom to enter a datetime',
    displayOptions: { show: { resource: ['snmp'], operation: ['getSettingDevices'] } },
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
        resource: ['snmp'],
        operation: ['getSettingDevices'],
        modifiedAfterPreset: ['CUSTOM'],
      },
    },
  },
  { displayName: 'Not Seen Since (ISO 8601 Z)', name: 'filterNotSeenSince', type: 'string', default: '', displayOptions: { show: { resource: ['snmp'], operation: ['getSettingDevices'] } } },
  { displayName: 'Device Type', name: 'filterDeviceTypeDevices', type: 'string', default: '', displayOptions: { show: { resource: ['snmp'], operation: ['getSettingDevices'] } } },
  { displayName: 'Make Model', name: 'filterMakeModelDevices', type: 'string', default: '', displayOptions: { show: { resource: ['snmp'], operation: ['getSettingDevices'] } } },
  { displayName: 'Vendor Name', name: 'filterVendorNameDevices', type: 'string', default: '', displayOptions: { show: { resource: ['snmp'], operation: ['getSettingDevices'] } } },

  // History common
  { displayName: 'Time Preset', name: 'timePreset', type: 'options', default: 'LAST_24_HOURS', options: [...dateTimePresetOptions.filter((o) => o.value !== 'NO_FILTER'), { name: 'Custom', value: 'CUSTOM' }], displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString', 'getHistoryNumeric'] } } },
  { displayName: 'From Time', name: 'fromTime', type: 'string', required: true, default: '', placeholder: 'YYYY-MM-DD HH:mm:ss', description: 'Lower bound (no timezone)', displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString', 'getHistoryNumeric'], timePreset: ['CUSTOM'] } } },
  { displayName: 'Thru Time', name: 'thruTime', type: 'string', default: '', placeholder: 'YYYY-MM-DD HH:mm:ss', description: 'Upper bound (no timezone)', displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString', 'getHistoryNumeric'], timePreset: ['CUSTOM'] } } },
  { displayName: 'Interval', name: 'interval', type: 'options', options: [ { name: 'Minute', value: 'minute' }, { name: 'Hour', value: 'hour' }, { name: 'Day', value: 'day' } ], default: 'hour', required: true, description: 'Statistics reporting interval', displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryNumeric'] } } },
  { displayName: 'Compact', name: 'compact', type: 'boolean', default: false, description: 'Show only changes in value (compact view). If false, date range limited to 24h', displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString'] } } },
  { displayName: 'Tenants', name: 'tenantsHistory', type: 'multiOptions', typeOptions: { loadOptionsMethod: 'getTenants' }, required: true, default: [], description: 'At least one tenant must be selected', displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString', 'getHistoryNumeric'] } } },
  { displayName: 'Device ID', name: 'deviceId', type: 'string', default: '', description: 'Device ID to filter history. Will be validated against selected tenant(s)', displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString', 'getHistoryNumeric'] } } },
  { displayName: 'SNMP Poller Setting IDs (CSV)', name: 'settingIdsCsv', type: 'string', default: '', description: 'Comma-separated list of SNMP Poller Setting IDs. If Device ID provided, will validate these settings apply to that device', displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString', 'getHistoryNumeric'] } } },
  { displayName: 'Debug Request', name: 'debugRequest', type: 'boolean', default: false, description: 'Include debug info and log the built request', displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString', 'getHistoryNumeric'] } } },
];


