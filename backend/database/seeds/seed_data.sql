INSERT INTO users (
    email,
    password_hash,
    full_name,
    role
) VALUES (
    'superadmin@hysten.com',
    '$2b$10$K7vrBZkTBZyz8fYoy054puV/I4h5wJ3UwXh1pBmLFpewMVE8Twu6O',
    'Super Admin',
    'super_admin'
);

INSERT INTO tenants (
    name,
    subdomain,
    status,
    subscription_plan,
    max_users,
    max_projects
) VALUES (
    'Demo Company',
    'demo',
    'active',
    'pro',
    20,
    10
);

INSERT INTO users (
    tenant_id,
    email,
    password_hash,
    full_name,
    role
)
SELECT
    id,
    'admin@demo.com',
    '$2b$10$aKIcVifFgSZpn7qai45xFOBkmkPT7jzjT9lEwlX9y.mOxD503Qo2y',
    'Demo Admin',
    'tenant_admin'
FROM tenants
WHERE subdomain = 'demo';

INSERT INTO users (
    tenant_id,
    email,
    password_hash,
    full_name,
    role
)
SELECT id,
       'user1@demo.com',
       '$2b$10$LME94fQDyl6J1.xHh4ztZeuHXZZ7LknIdBeU2wnEj0PAQN5eu5i46',
       'User One',
       'user'
FROM tenants WHERE subdomain = 'demo';

INSERT INTO users (
    tenant_id,
    email,
    password_hash,
    full_name,
    role
)
SELECT id,
       'user2@demo.com',
       '$2b$10$LME94fQDyl6J1.xHh4ztZeuHXZZ7LknIdBeU2wnEj0PAQN5eu5i46',
       'User Two',
       'user'
FROM tenants WHERE subdomain = 'demo';
