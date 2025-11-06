# Changelog

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
