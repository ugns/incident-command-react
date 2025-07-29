# Project UML & Access Control Overview

## Models & Contexts

```mermaid
classDiagram

  class User {
    string email
    string name
    string org_id
    string org_name
    string? picture
    string? sub
    // ...other fields
  }

  class Incident {
    string incidentId
    string org_id
    string name
    // ...other fields
  }

  class Organization {
    string org_id
    string name
    string aud
    // ...other fields
  }

  class Period {
    string periodId
    string incidentId
    string org_id
    string? incidentName
    string startTime
    string endTime
    string? name
    string? icsPosition
    string? homeAgency
    string description
  }

  class Volunteer {
    // ...fields (not fully shown)
  }

  class AuthContext {
    User user
    string token
    login(token, user)
    logout()
  }

  class OrganizationContext {
    Organization[] organizations
    addOrganization()
    updateOrganization()
    deleteOrganization()
    refresh()
  }

  class PeriodContext {
    Period[] periods
    selectedPeriod
    setSelectedPeriod()
    refreshPeriods()
    addPeriod()
    updatePeriod()
    deletePeriod()
  }

  class VolunteerContext {
    Volunteer[] volunteers
    addVolunteer()
    updateVolunteer()
    deleteVolunteer()
    refresh()
  }



  User "1" -- "1" Organization : belongs to
  Incident "*" -- "1" Organization : for
  Period "*" -- "1" Incident : for
  Period "*" -- "1" Organization : for
  Volunteer "*" -- "1" Organization : for

  AuthContext "1" o-- "1" User : provides
  OrganizationContext "1" o-- "*" Organization : manages
  PeriodContext "1" o-- "*" Period : manages
  VolunteerContext "1" o-- "*" Volunteer : manages

  class AuthContext {
    <<Access: All authenticated routes>>
  }
  class OrganizationContext {
    <<Access: admin/superAdmin only for add/update/delete>>
  }
  class PeriodContext {
    <<Access: authenticated, some actions admin only>>
  }
  class VolunteerContext {
    <<Access: authenticated, some actions admin only>>
  }
```

### TODO / Planned

- The `Incident` model and its relationships are planned for future implementation.
- `Period.incidentId` is not yet implemented in the codebase.
- Update CRUD and context logic as the Incident model is introduced.
```

## Access Control Summary

- **AuthContext**: Required for all authenticated routes.
- **OrganizationContext**: Add/update/delete restricted to admin or superAdmin (checked via LaunchDarkly flags).
- **PeriodContext** & **VolunteerContext**: Read for authenticated users; add/update/delete typically admin-only (checked via flags).
- **LaunchDarkly flags** (`adminAccess`, `superAdminAccess`): Used in the UI to enable/disable admin features.

## Notes
- Access control is enforced in the UI (via flags) and should also be enforced on the backend API.
- Providers wrap the app and provide context to components.
- The `User` model is extended with organization info for context and flag targeting.
