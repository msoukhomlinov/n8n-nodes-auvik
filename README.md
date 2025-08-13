# n8n-nodes-auvik

An n8n community node for Auvik’s JSON:API.

### Features
- Tenants, Devices, Networks, Interfaces
- Alert History, Alert (dismiss)
- Usage (client/device)
- Component, Configuration, Entity
- SNMP Poller (settings, devices, history), ASM (selected endpoints)
- Cursor-based pagination preserving filters and include/fields
- Region-aware base URL and Custom URL support

### Credentials
Provide:
- Email: Auvik user email
- API Key: Auvik API key
- Region: `us1`, `eu1`, `au1`, or `Custom URL`
- Base URL (when Region is Custom): e.g., `https://auvikapi.eu1.my.auvik.com/v1`

Auth is Basic (`email:apiKey`). All requests set `Accept: application/vnd.api+json`.

Privacy note: This node does not persist credentials or access tokens. Load-option caches are keyed to the API base URL only and expire quickly.

### Pagination
Endpoints use cursor pagination with `page[first]` and `page[after]` (forward). The node automatically follows `links.next.meta.cursor` and preserves original filters, `include`, and `fields[]`.

### Date/Time Format
Use ISO 8601 with milliseconds and trailing Z: `YYYY-MM-DDTHH:mm:ss.SSS[Z]`.

### Usage Examples
- Devices: filter by deviceType/vendor, include `deviceDetail`, restrict with `fields[deviceDetail]`.
- Networks: filter by networkType/scanStatus, include `networkDetail`.
- Interfaces: filter by interfaceType/admin/operational.
- Alert History: filter severity/status, time windows, dismissed.
- Alert: dismiss alert by ID.
- Usage: client usage by date window (optionally per tenant), device usage by ID and date window.

### Development
- Build: `npm run build`
- Lint: `npm run lint`

### License
MIT — see [LICENSE](LICENSE)

### Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)
