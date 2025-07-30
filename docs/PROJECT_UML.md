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
    string org_id
    string startTime
    string endTime
    string? name
    string description
    // ...other fields
  }

  class Volunteer {
    string volunteerId
    string org_id
    string name
    string? familyName
    string? givenName
    string email
    string? cellphone
    string? icsPosition
    string? homeAgency
    VolunteerStatus status
    string? callsign
    string? radio (radioId)
    string? currentLocation
    string? notes
  }

  class Agency {
    string agencyId
    string org_id
    string name
    string contactPerson
    string address
    string phone
  }

  class Radio {
    string radioId
    string name
    string? serialNumber
    string? assignedToVolunteerId
    RadioStatus status
    string? hostAgency
    string? notes
  }

  class Location {
    string locationId
    string org_id
    string name
    string? description
    float? latitude
    float? longitude
    string? address
    string? unitId
    LocationStatus status
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

  class AgencyContext {
    Agency[] agencies
    addAgency()
    updateAgency()
    deleteAgency()
    refresh()
  }

  class RadioContext {
    Radio[] radios
    addRadio()
    updateRadio()
    deleteRadio()
    refresh()
  }

  class LocationContext {
    Location[] locations
    addLocation()
    updateLocation()
    deleteLocation()
    refresh()
  }




  User "1" -- "1" Organization : belongs to
  Incident "*" -- "1" Organization : for
  Period "*" -- "1" Organization : for
  Volunteer "*" -- "1" Organization : for
  Agency "*" -- "1" Organization : for
  Radio "*" -- "1" Organization : for
  Location "*" -- "1" Organization : for
  Radio "*" -- "0..1" Agency : host/loaned by
  Volunteer "0..1" -- "1" Radio : assigned

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
  class AgencyContext {
    <<Access: admin/superAdmin only for add/update/delete>>
  }
  class RadioContext {
    <<Access: authenticated, some actions admin only>>
  }
  class LocationContext {
    <<Access: authenticated, some actions admin only>>
  }
```


### TODO / Planned

- The `Incident` model and its relationships are planned for future implementation.
- Agency, Radio, and Location CRUD/context logic to be implemented as backend endpoints are added.
```


## Contexts Overview

### AuthContext
- Provides authentication state and user info to the app.
- Exposes: `user`, `token`, `login(token, user)`, `logout()`.
- Required for all authenticated routes.

### OrganizationContext
- Manages the list of organizations for the current user.
- Exposes: `organizations`, `addOrganization()`, `updateOrganization()`, `deleteOrganization()`, `refresh()`.
- Add/update/delete restricted to admin/superAdmin.

### PeriodContext
- Manages periods (operational periods) for the current org.
- Exposes: `periods`, `selectedPeriod`, `setSelectedPeriod()`, `refreshPeriods()`, `addPeriod()`, `updatePeriod()`, `deletePeriod()`.
- Read for authenticated users; add/update/delete typically admin-only.

### VolunteerContext
- Manages volunteers for the current org.
- Exposes: `volunteers`, `addVolunteer()`, `updateVolunteer()`, `deleteVolunteer()`, `refresh()`.
- Read for authenticated users; add/update/delete typically admin-only.

### AgencyContext
- Manages agencies for the current org.
- Exposes: `agencies`, `addAgency()`, `updateAgency()`, `deleteAgency()`, `refresh()`.
- Add/update/delete restricted to admin/superAdmin.

### RadioContext
- Manages radios for the current org.
- Exposes: `radios`, `addRadio()`, `updateRadio()`, `deleteRadio()`, `refresh()`.
- Read for authenticated users; add/update/delete typically admin-only.

### LocationContext
- Manages locations for the current org.
- Exposes: `locations`, `addLocation()`, `updateLocation()`, `deleteLocation()`, `refresh()`.
- Read for authenticated users; add/update/delete typically admin-only.

---

## Access Control Summary

- **AuthContext**: Required for all authenticated routes.
- **OrganizationContext**: Add/update/delete restricted to admin or superAdmin (checked via LaunchDarkly flags).
- **PeriodContext** & **VolunteerContext**: Read for authenticated users; add/update/delete typically admin-only (checked via flags).
- **LaunchDarkly flags** (`adminAccess`, `superAdminAccess`): Used in the UI to enable/disable admin features.

## Notes
- Access control is enforced in the UI (via flags) and should also be enforced on the backend API.
- Providers wrap the app and provide context to components.
- The `User` model is extended with organization info for context and flag targeting.
