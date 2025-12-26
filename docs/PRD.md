# Product Requirements Document

## User Personas

### Super Admin
**Description:** …
**Responsibilities:** …
**Goals:** …
**Pain Points:** …

### Tenant Admin
…

### End User
…
## Functional Requirements

### Authentication
FR-001 The system shall allow user login using email and password.
FR-002 The system shall issue JWT tokens valid for 24 hours.

### Tenant Management
FR-003 The system shall allow tenant registration with unique subdomain.
FR-004 The system shall assign free plan by default.

### Users
FR-005 …
## Non-Functional Requirements

NFR-001 Performance: API response time < 200ms for 90% requests.
NFR-002 Security: Passwords must be hashed using bcrypt.
NFR-003 Scalability: Support 100 concurrent users.
NFR-004 Availability: 99% uptime.
NFR-005 Usability: Mobile responsive UI.
