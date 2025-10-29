# n8n-nodes-auvik

An n8n community node for Auvik’s JSON:API.

> Status: First public release — v0.5.0 (2025-10-29)

### Release
This is the first public release of the Auvik community node for n8n. See the [Changelog](CHANGELOG.md) for details.

### Features
- Tenants: list, detail
- Devices (v1): info with filters, `include` and `fields[]`
- Device V2 (Beta): high-volume device listing with updated schema and filters
- Networks: info and detail
- Interfaces: info
- Alert History: list with filters
- Alert: dismiss by ID (write operation)
- Usage: client/device
- Component, Configuration, Entity
- SNMP Poller: settings, devices, history
- ASM: selected endpoints
- Cursor pagination preserving filters and include/fields (v1)
- Region-aware base URL and Custom URL support

### Credentials
Provide:
- Email: Auvik user email
- API Key: Auvik API key
- Region: `us1`, `eu1`, `au1`, or `Custom URL`
- Base URL (when Region is Custom): e.g., `https://auvikapi.eu1.my.auvik.com/v1`

Auth is Basic (`email:apiKey`). All requests set `Accept: application/vnd.api+json`.

Privacy note: This node does not persist credentials or access tokens. Load-option caches are keyed to the API base URL only and expire quickly.

Note: This node is primarily read-only. The only write operation currently implemented is alert dismissal.

### Pagination
Endpoints use cursor pagination with `page[first]` and `page[after]` (forward). The node automatically follows `links.next.meta.cursor` and preserves original filters, `include`, and `fields[]`.

### Date/Time Format
Use ISO 8601 with milliseconds and trailing Z: `YYYY-MM-DDTHH:mm:ss.SSS[Z]`.

### API v2 Support (Beta)
API v2 device support is Beta and subject to change. Prefer v1 when you need relationships or `include`/`fields[]`.

The node now supports Auvik's API v2 for Device operations, offering improved performance and enhanced data structure:

**Device V2 (Beta) Resource**:
- **Enhanced Performance**: Default page size increased to 1000 (max 10,000)
- **Simplified Tenant Selection**: Single tenant parameter with automatic child tenant inclusion
- **Updated Schema**: 
  - `vendorName` → `make`
  - `makeModel` → `model` (model only)
  - New `makeModel` field contains both make and model combined
  - `manageStatus` moved to main attributes (boolean)
  - Removed: `lastModified`, `stateKnown`, `deviceDetail` relationship
- **New Filters**: `manageStatus` (boolean) for managed/unmanaged devices
- **Broader Scope**: Includes endpoint & service devices (like web client)

**When to Use v1 vs v2**:
- **Use Device V2**: For bulk device operations, better performance, simplified tenant management
- **Use Device V1**: When you need `deviceDetail` relationships, `include`/`fields[]` parameters, or specific v1-only filters

**Migration Notes**:
- Field names have changed (see schema differences above)
- Tenant selection is now single-select (children auto-included)
- No `include` or `fields[]` parameters in v2
- Larger default page sizes for better performance

### Compatibility
- n8n: Node.js >= 18.10
- Auvik API: v1 fully supported across resources listed above; Device v2 in Beta.

### Usage Examples
- Devices: filters include `tenants`, `deviceType`, `vendorName`, `makeModel`, `onlineStatus`,
  `modifiedAfter`, `notSeenSince`, `stateKnown`, `trafficInsightsStatus`, and `networks`.
  You can include `deviceDetail` and restrict via `fields[deviceDetail]`.
- Networks: filter by networkType/scanStatus, include `networkDetail`. Detail endpoints are available:
  - Read Multiple Networks’ Details (`GET /v1/inventory/network/detail`) supports common filters plus `filter[scope]`.
  - Read a Single Network’s Details (`GET /v1/inventory/network/detail/{id}`).
- Interfaces: filter by interfaceType/admin/operational.
- Alert History: filter severity/status, time windows, dismissed.
- Alert: dismiss alert by ID.
- SNMP Poller:
  - Settings: requires `tenants` and supports filters (`useAs`, `type`, `deviceType`, `makeModel`, `vendorName`, `oid`, `name`, `deviceId`).
  - Setting Devices: requires `tenants` and supports filters (`onlineStatus`, `modifiedAfter`, `notSeenSince`, `deviceType`, `makeModel`, `vendorName`). Cursor pagination is handled automatically.
  - History: `string` and `numeric` endpoints require `tenants` and `fromTime` (no TZ, `YYYY-MM-DD HH:mm:ss`); numeric requires `interval`.
- Usage: client usage by date window (optionally per tenant), device usage by ID and date window.

### Roadmap / Limitations
- Write operations are intentionally limited; only alert dismiss is implemented.
- Maintenance windows are not supported (no public endpoint found).
- Configuration content is not exposed by Auvik API; only attributes are available.

### Development
- Build: `npm run build`
- Lint: `npm run lint`

### License
MIT — see [LICENSE](LICENSE)

### Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)
