import type {
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
      default: 'au1',
      description:
        'Find your region in the three-letter code before my.auvik.com when logged into Auvik (e.g. us2).',
      options: [
        { name: 'US East (North Virginia) - US1', value: 'us1' },
        { name: 'US West (Oregon) - US2', value: 'us2' },
        { name: 'US East (North Virginia) - US3', value: 'us3' },
        { name: 'US East (Ohio) - US4', value: 'us4' },
        { name: 'US East (Ohio) - US5', value: 'us5' },
        { name: 'US East (Ohio) - US6', value: 'us6' },
        { name: 'EU West (Ireland) - EU1', value: 'eu1' },
        { name: 'EU Central (Frankfurt) - EU2', value: 'eu2' },
        { name: 'Asia-Pacific (Sydney) - AU1', value: 'au1' },
        { name: 'Canada (Central) - CA1', value: 'ca1' },
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
        : `https://auvikapi.${region}.my.auvik.com`;
    const email = String(credentials.email || '').trim();
    const apiKey = String(credentials.apiKey || '').trim();
    return { computedBaseUrl: resolved };
  }

  // Provide generic authenticate so Credential Test can attach Basic header automatically
  authenticate = {
    type: 'generic',
    properties: {
      headers: {
        Authorization:
          '={{"Basic " + $base64.encode((($credentials.email || "").trim()) + ":" + (($credentials.apiKey || "").trim()))}}',
        Accept: 'application/vnd.api+json',
      },
    },
  } as const;

}


