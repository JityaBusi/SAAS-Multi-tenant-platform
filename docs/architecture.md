## System Architecture

The system follows a three-tier architecture consisting of a client layer, application layer, and data layer.

Users access the application via a tenant-specific subdomain using a web browser. The frontend React application communicates with the backend API over secure HTTP. Authentication is handled using JSON Web Tokens (JWT).

Upon successful login, the backend issues a JWT containing user identity, role, tenant ID, and expiration time. The frontend includes this token in the Authorization header for all subsequent API requests. The backend validates the token on each request and enforces role-based access control, tenant data isolation, and subscription plan limits before accessing the PostgreSQL database.

## Database Schema Design

The database uses a shared schema multi-tenancy model. Each core table includes a tenant_id column to enforce data isolation.

Foreign key constraints ensure referential integrity, and indexes on tenant_id columns improve query performance. Cascade deletes are applied where appropriate to automatically clean up tenant-related data.

## API Architecture

### Authentication
POST /api/auth/login – Public
POST /api/auth/register – Public

### Tenants
POST /api/tenants – Super Admin only
GET /api/tenants – Super Admin only

### Users
POST /api/users – Tenant Admin
GET /api/users – Tenant Admin

### Projects
POST /api/projects – Tenant Admin
GET /api/projects – Authenticated Users

### Tasks
POST /api/tasks – Authenticated Users
PUT /api/tasks/:id – Assigned User
