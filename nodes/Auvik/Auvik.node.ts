import type {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodePropertyOptions,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { tenantFields, tenantOperations } from './resources/tenants/description';
import { executeTenant } from './resources/tenants/execute';
import { deviceFields, deviceOperations } from './resources/device/description';
import { executeDevice } from './resources/device/execute';
import { deviceV2Fields, deviceV2Operations } from './resources/device-v2/description';
import { executeDeviceV2 } from './resources/device-v2/execute';
import { networkFields, networkOperations } from './resources/network/description';
import { executeNetwork } from './resources/network/execute';
import { interfaceFields, interfaceOperations } from './resources/interface/description';
import { executeInterface } from './resources/interface/execute';
import { alertHistoryFields, alertHistoryOperations } from './resources/alert-history/description';
import { executeAlertHistory } from './resources/alert-history/execute';
import { alertFields, alertOperations } from './resources/alert/description';
import { executeAlert } from './resources/alert/execute';
import { usageFields, usageOperations } from './resources/usage/description';
import { executeUsage } from './resources/usage/execute';
import { getAllByCursor } from './helpers/pagination';
import { requestAuvik } from './helpers/http/request';
import { kvFileCache, buildCacheKey } from './helpers/cache/kvFileCache';
import { componentFields, componentOperations } from './resources/component/description';
import { executeComponent } from './resources/component/execute';
import { configurationFields, configurationOperations } from './resources/configuration/description';
import { executeConfiguration } from './resources/configuration/execute';
import { entityFields, entityOperations } from './resources/entity/description';
import { executeEntity } from './resources/entity/execute';
import { snmpFields, snmpOperations } from './resources/snmp/description';
import { executeSnmp } from './resources/snmp/execute';
import { asmFields, asmOperations } from './resources/asm/description';
import { executeAsm } from './resources/asm/execute';
import { resolveBaseUrl } from './constants/index';
import { playbookFields, playbookOperations } from './resources/playbook/description';
import { executePlaybook } from './resources/playbook/execute';

export class Auvik implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Auvik',
    name: 'auvik',
    icon: 'file:auvik.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Interact with Auvik API',
    defaults: {
      name: 'Auvik',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'auvikApi',
        required: false,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Tenant',
            value: 'tenant',
          },
          {
            name: 'Device',
            value: 'device',
          },
          {
            name: 'Device V2 (Beta)',
            value: 'deviceV2',
          },
          {
            name: 'Network',
            value: 'network',
          },
          {
            name: 'Interface',
            value: 'interface',
          },
          {
            name: 'Alert History',
            value: 'alertHistory',
          },
          {
            name: 'Alert',
            value: 'alert',
          },
          {
            name: 'Usage',
            value: 'usage',
          },
          { name: 'Component', value: 'component' },
          { name: 'Configuration', value: 'configuration' },
          { name: 'Entity', value: 'entity' },
          { name: 'SNMP Poller', value: 'snmp' },
          { name: 'ASM', value: 'asm' },
          { name: 'Playbook', value: 'playbook' },
        ],
        default: 'tenant',
      },
      tenantOperations,
      ...tenantFields,
      deviceOperations,
      ...deviceFields,
      deviceV2Operations,
      ...deviceV2Fields,
      networkOperations,
      ...networkFields,
      interfaceOperations,
      ...interfaceFields,
      alertHistoryOperations,
      ...alertHistoryFields,
      alertOperations,
      ...alertFields,
      usageOperations,
      ...usageFields,
      componentOperations,
      ...componentFields,
      configurationOperations,
      ...configurationFields,
      entityOperations,
      ...entityFields,
      snmpOperations,
      ...snmpFields,
      asmOperations,
      ...asmFields,
      playbookOperations,
      ...playbookFields,
    ],
  };

  methods = {
    loadOptions: {
      async getTenants(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const creds = await this.getCredentials('auvikApi');
        const region = String((creds as any)?.region ?? 'us1');
        const customBaseUrl = ((creds as any)?.baseUrl as string) || undefined;
        const baseURL = ((creds as any)?.computedBaseUrl as string) || resolveBaseUrl(region, customBaseUrl);
        const cacheKey = buildCacheKey(['tenants', baseURL]);
        const cached = await kvFileCache.get<INodePropertyOptions[]>(cacheKey);
        if (cached) return cached;
        const results = await getAllByCursor.call(this, { path: '/tenants', apiVersion: 'v1' });
        const options = (results || []).map((r: any) => {
          const name = r?.attributes?.displayName || r?.attributes?.domainPrefix || r?.id;
          return { name: String(name), value: String(r?.id) };
        });
        await kvFileCache.set(cacheKey, options, 5 * 60 * 1000);
        return options;
      },
      async getDevicesByTenant(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const selectedTenants = (this.getCurrentNodeParameter('tenants') as string[]) || [];
        const tenantsCsv = Array.isArray(selectedTenants) ? selectedTenants.join(',') : String(selectedTenants || '');
        const creds = await this.getCredentials('auvikApi');
        const region = String((creds as any)?.region ?? 'us1');
        const customBaseUrl = ((creds as any)?.baseUrl as string) || undefined;
        const baseURL = ((creds as any)?.computedBaseUrl as string) || resolveBaseUrl(region, customBaseUrl);
        const cacheKey = buildCacheKey(['devicesByTenant', tenantsCsv, baseURL]);
        const cached = await kvFileCache.get<INodePropertyOptions[]>(cacheKey);
        if (cached) return cached;
        const results = await getAllByCursor.call(this, {
          path: '/inventory/device/info',
          apiVersion: 'v1',
          qs: tenantsCsv ? { tenants: tenantsCsv } : {},
          fields: {
            device:
              [
                // Prefer canonical API fields first
                'deviceName',
                'ipAddresses',
                // Fallbacks observed in responses
                'ipAddress',
                'primaryIp',
                'primaryIpAddress',
                'displayName',
                'sysName',
                'name',
                'fqdn',
                'hostname',
                'hostName',
              ].join(','),
          },
        });
        const options = (results || [])
          .map((r: any) => {
            const attrs = (r && r.attributes) || {};
            const idStr = String(r?.id || '');
            const shortId = idStr.length >= 6 ? idStr.slice(-6) : idStr.slice(0, 6);
            const candidatePrimary =
              attrs.deviceName ||
              attrs.displayName ||
              attrs.sysName ||
              attrs.name ||
              attrs.fqdn ||
              '';
            const ipRaw =
              attrs.primaryIp ||
              attrs.primaryIpAddress ||
              attrs.ipAddress ||
              (Array.isArray(attrs.ipAddresses) ? attrs.ipAddresses[0] : '');
            const candidatePrimaryNotId = candidatePrimary && candidatePrimary !== idStr ? String(candidatePrimary) : '';
            const primaryName = candidatePrimaryNotId && String(candidatePrimaryNotId).toLowerCase() !== String(ipRaw || '').toLowerCase()
              ? candidatePrimaryNotId
              : '';
            const host = attrs.hostname || attrs.hostName || '';
            const ip = ipRaw ? String(ipRaw) : '';

            const baseName = (primaryName || host || ip || 'Device').toString().trim();
            const sameHostAsPrimary = host && primaryName && host.toString().trim().toLowerCase() === primaryName.toString().trim().toLowerCase();
            const hostIsIp = host && ip && host.toString().trim().toLowerCase() === ip.toString().trim().toLowerCase();
            const hostPart = host && !sameHostAsPrimary && !hostIsIp ? ` (${String(host).trim()})` : '';
            const ipEqualsBase = ip && baseName && ip.toString().trim().toLowerCase() === baseName.toLowerCase();
            const ipPart = ip && !ipEqualsBase ? ` [${ip}]` : '';
            const label = `${baseName}${hostPart}${ipPart} — ${shortId}`;

            return { name: label, value: idStr } as INodePropertyOptions;
          })
          .sort((a: INodePropertyOptions, b: INodePropertyOptions) => a.name.localeCompare(b.name));
        await kvFileCache.set(cacheKey, options, 2 * 60 * 1000);
        return options;
      },
      async getNetworksByTenant(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const selectedTenants = (this.getCurrentNodeParameter('tenants') as string[]) || [];
        const tenantsCsv = Array.isArray(selectedTenants) ? selectedTenants.join(',') : String(selectedTenants || '');
        const creds = await this.getCredentials('auvikApi');
        const region = String((creds as any)?.region ?? 'us1');
        const customBaseUrl = ((creds as any)?.baseUrl as string) || undefined;
        const baseURL = ((creds as any)?.computedBaseUrl as string) || resolveBaseUrl(region, customBaseUrl);
        const cacheKey = buildCacheKey(['networksByTenant', tenantsCsv, baseURL]);
        const cached = await kvFileCache.get<INodePropertyOptions[]>(cacheKey);
        if (cached) return cached;
        const results = await getAllByCursor.call(this, {
          path: '/inventory/network/info',
          apiVersion: 'v1',
          qs: tenantsCsv ? { tenants: tenantsCsv } : {},
        });
        const options = (results || []).map((r: any) => {
          const name = r?.attributes?.displayName || r?.attributes?.name || r?.id;
          return { name: String(name), value: String(r?.id) };
        });
        await kvFileCache.set(cacheKey, options, 2 * 60 * 1000);
        return options;
      },
    },
  };

  async execute(this: IExecuteFunctions) {
    const resource = this.getNodeParameter('resource', 0) as string;
    if (resource === 'tenant') {
      return await executeTenant.call(this);
    }
    if (resource === 'device') {
      return await executeDevice.call(this);
    }
    if (resource === 'deviceV2') {
      return await executeDeviceV2.call(this);
    }
    if (resource === 'network') {
      return await executeNetwork.call(this);
    }
    if (resource === 'interface') {
      return await executeInterface.call(this);
    }
    if (resource === 'alertHistory') {
      return await executeAlertHistory.call(this);
    }
    if (resource === 'alert') {
      return await executeAlert.call(this);
    }
    if (resource === 'usage') {
      return await executeUsage.call(this);
    }
    if (resource === 'component') {
      return await executeComponent.call(this);
    }
    if (resource === 'configuration') {
      return await executeConfiguration.call(this);
    }
    if (resource === 'entity') {
      return await executeEntity.call(this);
    }
    if (resource === 'snmp') {
      return await executeSnmp.call(this);
    }
    if (resource === 'asm') {
      return await executeAsm.call(this);
    }
    if (resource === 'playbook') {
      return await executePlaybook.call(this);
    }
    return [this.helpers.returnJsonArray([])];
  }
}


