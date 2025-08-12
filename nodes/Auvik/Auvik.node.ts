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
        ],
        default: 'tenant',
      },
      tenantOperations,
      ...tenantFields,
      deviceOperations,
      ...deviceFields,
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
    ],
  };

  methods = {
    loadOptions: {
      async getTenants(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const creds = await this.getCredentials('auvikApi');
        const cacheKey = buildCacheKey(['tenants', creds ? JSON.stringify(creds) : '']);
        const cached = await kvFileCache.get<INodePropertyOptions[]>(cacheKey);
        if (cached) return cached;
        const results = await getAllByCursor.call(this, { path: '/tenants' });
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
        const cacheKey = buildCacheKey(['devicesByTenant', tenantsCsv, creds ? JSON.stringify(creds) : '']);
        const cached = await kvFileCache.get<INodePropertyOptions[]>(cacheKey);
        if (cached) return cached;
        const results = await getAllByCursor.call(this, {
          path: '/inventory/device/info',
          qs: tenantsCsv ? { tenants: tenantsCsv } : {},
        });
        const options = (results || []).map((r: any) => {
          const name = r?.attributes?.displayName || r?.attributes?.sysName || r?.id;
          return { name: String(name), value: String(r?.id) };
        });
        await kvFileCache.set(cacheKey, options, 2 * 60 * 1000);
        return options;
      },
      async getNetworksByTenant(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const selectedTenants = (this.getCurrentNodeParameter('tenants') as string[]) || [];
        const tenantsCsv = Array.isArray(selectedTenants) ? selectedTenants.join(',') : String(selectedTenants || '');
        const creds = await this.getCredentials('auvikApi');
        const cacheKey = buildCacheKey(['networksByTenant', tenantsCsv, creds ? JSON.stringify(creds) : '']);
        const cached = await kvFileCache.get<INodePropertyOptions[]>(cacheKey);
        if (cached) return cached;
        const results = await getAllByCursor.call(this, {
          path: '/inventory/network/info',
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
    return [this.helpers.returnJsonArray([])];
  }
}


