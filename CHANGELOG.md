# Changelog

## [0.1.1] - 2025-08-13
- Add Playbook resource with operations:
  - Triage Alerts (list + optional bulk dismiss with device context and utilisation)
  - Health Snapshot (devices, interfaces, alerts, ASM summary)

## [0.1.0] - 2025-08-13
- Initial Auvik n8n node
  - Credentials with region/custom URL and credential test
  - HTTP wrapper, error mapping, and cursor pagination
  - Resources: Tenants, Devices, Networks, Interfaces, Alert History, Alert (dismiss), Usage (client/device)
  - Load options for tenants, devices by tenant, networks by tenant
