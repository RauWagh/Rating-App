-- Seed admin and sample data
INSERT INTO users (id, name, email, address, password_hash, role)
VALUES
  (gen_random_uuid(), 'System Administrator User', 'admin@example.com', 'HQ', '$2a$10$Y5yqCkXr4v0G9qUeCwZrEee6QGxqOZg6e7GK1xHCQax0yClq5/YW6', 'ADMIN') -- password: Admin@123
ON CONFLICT DO NOTHING;

-- Create an owner
WITH owner AS (
  INSERT INTO users (id, name, email, address, password_hash, role)
  VALUES (gen_random_uuid(), 'Owner Account Example', 'owner@example.com', 'Owner Address', '$2a$10$Y5yqCkXr4v0G9qUeCwZrEee6QGxqOZg6e7GK1xHCQax0yClq5/YW6', 'OWNER')
  RETURNING id
)
INSERT INTO stores (id, name, email, address, owner_id)
SELECT gen_random_uuid(), 'Blue Market', 'store@example.com', '123 Market St, City', owner.id FROM owner
ON CONFLICT DO NOTHING;

-- Create a normal user
INSERT INTO users (id, name, email, address, password_hash, role)
VALUES (gen_random_uuid(), 'Normal Registered User Name', 'user@example.com', 'User Address', '$2a$10$Y5yqCkXr4v0G9qUeCwZrEee6QGxqOZg6e7GK1xHCQax0yClq5/YW6', 'USER')
ON CONFLICT DO NOTHING;
