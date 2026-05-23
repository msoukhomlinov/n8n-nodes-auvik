# Changelog

## [0.5.6] - 2026-05-23
### Added
- Device (v1): `Get Warranty` operation (`GET /inventory/device/warranty/{id}`)
- Device (v1): `Get Lifecycle` operation (`GET /inventory/device/lifecycle/{id}`)
- Friendly error messages for 401/403/404/429/5xx responses when Auvik returns no JSON:API `errors[]` body

### Fixed
- HTTP retry layer now detects Auvik's 403-rate-limit responses (body matching "rate limit", "throttle", or "too many requests") and retries them on a 1s/4s/16s/60s curve. 5xx retries unchanged (1s/2s/4s, 10s ceiling). Default retries bumped from 3 to 4 so the rate-limit curve actually reaches the 60s ceiling.
- `Retry-After` header now only honours delta-seconds form. HTTP-date form previously parsed to `NaN`, which `setTimeout` treats as 0 — a hot retry loop. Non-numeric values fall back to the exponential curve.
- All non-retried HTTP failures now route through `mapAuvikError`, surfacing vendor detail and friendly status messages instead of a generic "Auvik API request failed".

## [0.5.5] - 2025-11-06
### Added
- Device (v1): Client-side filtering by device name

## [0.5.4] - 2025-11-06
### Fixed
- SNMP Poller Get History operations now correctly align with Auvik API specification
  - Added validation to ensure `tenants` parameter is provided (required by API)
  - Fixed `filter[compact]` parameter to send string `"true"` instead of boolean
  - Removed `filter[compact]` from numeric endpoint (only supported on string endpoint)
  - Ensured `tenants` parameter is always included in requests
  - Updated UI to only show Compact field for string history operations
- Alphabetised picklists across Auvik resources with "Any" first (Device v1/v2, Interface, Component, Network, Entity, Alert History, Configuration, Playbook, SNMP).
- Device (v1): Added "— Any —" option to Online Status filter
- Corrected description apostrophes
- Normalised option order for Device Type, Online Status and TrafficInsights status.

### Changed
- Date/time preset fields across all resources now default to No Filter (`NO_FILTER`).
  - Makes filtering opt-in and avoids unintended time constraints.
  - Execution logic updated to ignore `NO_FILTER` (no date params sent).
- Resources list sorted alphabetically

### Added
- SNMP Poller Get History operations now validate inputs before making API requests
  - Validates device ID exists within selected tenant(s)
  - Validates SNMP Poller Setting IDs are configured for the specified device
  - Validates SNMP Poller Settings are configured as 'poller' (not 'serialNo') to ensure they collect historical data
  - Provides detailed error message when no historical data is found, including possible reasons and troubleshooting tips
  - Suggests using 'Get Settings' operation to retrieve valid Setting IDs
  - Logs validation success for troubleshooting

## [0.5.3] - 2025-10-29
- Initial public release
