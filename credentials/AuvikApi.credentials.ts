import type {
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
  IHttpRequestHelper,
  ICredentialDataDecryptedObject,
  IDataObject,
} from 'n8n-workflow';

export class AuvikApi implements ICredentialType {
  name = 'auvikApi';
  displayName = 'Auvik API';
  documentationUrl = 'https://docs.auvik.com/';

  properties: INodeProperties[] = [
    {
      displayName: 'Email',
      name: 'email',
      type: 'string',
      typeOptions: { password: false },
      default: '',
      required: true,
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
    {
      displayName: 'Region',
      name: 'region',
      type: 'options',
      default: 'us1',
      options: [
        { name: 'US1', value: 'us1' },
        { name: 'EU1', value: 'eu1' },
        { name: 'AU1', value: 'au1' },
        { name: 'Custom URL', value: 'custom' },
      ],
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: '',
      description: 'Set only when Region is Custom URL',
      displayOptions: {
        show: {
          region: ['custom'],
        },
      },
    },
  ];

  // Compute base URL from region/custom before auth and tests
  async preAuthentication(
    this: IHttpRequestHelper,
    credentials: ICredentialDataDecryptedObject,
  ): Promise<IDataObject> {
    const region = String(credentials.region || 'us1');
    const customBase = String(credentials.baseUrl || '');
    const resolved =
      region === 'custom' && customBase
        ? customBase
        : `https://auvikapi.${region}.my.auvik.com/v1`;
    return { computedBaseUrl: resolved };
  }

  authenticate = {
    type: 'httpBasicAuth',
    properties: {
      user: '={{($credentials.email || "").trim()}}',
      password: '={{($credentials.apiKey || "").trim()}}',
    },
  } as const;

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.computedBaseUrl || ($credentials.region === "custom" ? $credentials.baseUrl : `https://auvikapi.${$credentials.region}.my.auvik.com/v1`)}}',
      url: '/authentication/verify',
      method: 'GET',
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };
}


