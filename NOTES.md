# Notes: Contact PII Access Control

Context: Email and cellphone are sensitive PII. We want controlled access to view and edit these fields without breaking existing workflows.

Proposed approach:

1) Separate permissions for view vs edit
- `canViewContactInfo`: can read email/cellphone
- `canEditContactInfo`: can modify email/cellphone
- Invariant: `canEditContactInfo` should imply `canViewContactInfo` to avoid a confusing UX.

2) UI behavior
- If `!canViewContactInfo`: render a "Restricted" placeholder or masked value instead of the actual data.
- If `!canEditContactInfo` but `canViewContactInfo`: render read-only or disabled inputs.
- Avoid the combo `!canViewContactInfo && canEditContactInfo`. If required, use an explicit "Replace" workflow with empty inputs.

3) Update flow (client)
- When user lacks edit access, omit `email` and `cellphone` from update payloads.
- Prefer PATCH with only changed fields to avoid overwriting protected data.

4) Server enforcement
- Server must be the source of truth for both view and edit.
- If user lacks view access, server should return null/omitted fields.
- If user lacks edit access, server should ignore or reject updates for those fields.

5) Feature flags
- Use LaunchDarkly flags only for rollout/visibility, not for security.
- Keep permissions authoritative; flags can enable UI changes gradually.

Server Team Checklist (for acceptance criteria)
- Define permissions/roles that map to `canViewContactInfo` and `canEditContactInfo`.
- Response shaping: omit or null `email`/`cellphone` when view is denied.
- Update behavior: reject or ignore `email`/`cellphone` updates when edit is denied.
- Partial update support: prefer PATCH semantics to avoid overwriting fields unintentionally.
- Audit logging: record access to PII fields (read and write) if required by policy.
- Error semantics: define consistent error codes/messages for denied edits.
- Tests: ensure no privilege escalation by crafted requests.

Deferred:
- Actual implementation changes to `ContactInfoField` and update handlers.
- API adjustments for field-level permissions and response filtering.
