import type { INodeProperties } from 'n8n-workflow';

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

  // History common
  { displayName: 'From Time', name: 'fromTime', type: 'string', required: true, default: '', placeholder: 'YYYY-MM-DD HH:mm:ss', displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString', 'getHistoryNumeric'] } } },
  { displayName: 'Thru Time', name: 'thruTime', type: 'string', default: '', placeholder: 'YYYY-MM-DD HH:mm:ss', displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString', 'getHistoryNumeric'] } } },
  { displayName: 'Compact', name: 'compact', type: 'boolean', default: false, displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString', 'getHistoryNumeric'] } } },
  { displayName: 'Tenants', name: 'tenantsHistory', type: 'multiOptions', typeOptions: { loadOptionsMethod: 'getTenants' }, required: true, default: [], displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString', 'getHistoryNumeric'] } } },
  { displayName: 'Device ID', name: 'deviceId', type: 'string', default: '', displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString', 'getHistoryNumeric'] } } },
  { displayName: 'SNMP Poller Setting IDs (CSV)', name: 'settingIdsCsv', type: 'string', default: '', description: 'Internal snmpPollerSettingId list (CSV)', displayOptions: { show: { resource: ['snmp'], operation: ['getHistoryString', 'getHistoryNumeric'] } } },
];


