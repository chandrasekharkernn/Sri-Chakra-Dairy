-- Sequelize Database Setup for Sri Chakra Diary
-- This script creates all necessary tables for the authentication and management system

-- Create database if it doesn't exist
-- CREATE DATABASE sri_chakra_diary;

-- Connect to the database
-- \c sri_chakra_diary;

-- Enable UUID extension (if needed)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (for authentication and employee management)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    hierarchy_level INTEGER DEFAULT 999,
    parent_role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scopes table (for permissions)
CREATE TABLE IF NOT EXISTS scopes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- JUNCTION TABLES (Many-to-Many Relationships)
-- =====================================================

-- User-Role relationship (Sequelize will create this automatically)
CREATE TABLE IF NOT EXISTS "UserRoles" (
    "UserId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "RoleId" INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("UserId", "RoleId")
);

-- User-Department relationship (Sequelize will create this automatically)
CREATE TABLE IF NOT EXISTS "UserDepartments" (
    "UserId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "DepartmentId" INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("UserId", "DepartmentId")
);

-- Role-Scope relationship
CREATE TABLE IF NOT EXISTS role_scopes (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    scope_id INTEGER NOT NULL REFERENCES scopes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, scope_id)
);

-- Department-Scope relationship
CREATE TABLE IF NOT EXISTS department_scopes (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    scope_id INTEGER NOT NULL REFERENCES scopes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(department_id, scope_id)
);

-- Employee-Scope relationship
CREATE TABLE IF NOT EXISTS employee_scopes (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scope_id INTEGER NOT NULL REFERENCES scopes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, scope_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Departments indexes
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(name);
CREATE INDEX IF NOT EXISTS idx_departments_manager_id ON departments(manager_id);

-- Roles indexes
CREATE INDEX IF NOT EXISTS idx_roles_role_name ON roles(role_name);
CREATE INDEX IF NOT EXISTS idx_roles_department_id ON roles(department_id);
CREATE INDEX IF NOT EXISTS idx_roles_parent_role_id ON roles(parent_role_id);
CREATE INDEX IF NOT EXISTS idx_roles_hierarchy_level ON roles(hierarchy_level);

-- Scopes indexes
CREATE INDEX IF NOT EXISTS idx_scopes_name ON scopes(name);
CREATE INDEX IF NOT EXISTS idx_scopes_type ON scopes(type);

-- Junction table indexes
CREATE INDEX IF NOT EXISTS idx_role_scopes_role_id ON role_scopes(role_id);
CREATE INDEX IF NOT EXISTS idx_role_scopes_scope_id ON role_scopes(scope_id);
CREATE INDEX IF NOT EXISTS idx_department_scopes_department_id ON department_scopes(department_id);
CREATE INDEX IF NOT EXISTS idx_department_scopes_scope_id ON department_scopes(scope_id);
CREATE INDEX IF NOT EXISTS idx_employee_scopes_employee_id ON employee_scopes(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_scopes_scope_id ON employee_scopes(scope_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scopes_updated_at BEFORE UPDATE ON scopes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional)
-- =====================================================

-- Insert default departments
INSERT INTO departments (name, description) VALUES
    ('IT Department', 'Information Technology and Systems'),
    ('HR Department', 'Human Resources and Administration'),
    ('Finance Department', 'Finance and Accounting'),
    ('Operations Department', 'Business Operations and Management')
ON CONFLICT (name) DO NOTHING;

-- Insert default scopes
INSERT INTO scopes (name, type, description, permissions) VALUES
    ('profile.me', 'user', 'Access own profile', '["read"]'),
    ('scope.read', 'scope', 'Read scopes', '["read"]'),
    ('scope.manage', 'scope', 'Manage scopes', '["read", "write", "delete"]'),
    ('department.read', 'department', 'Read departments', '["read"]'),
    ('department.manage', 'department', 'Manage departments', '["read", "write", "delete"]'),
    ('role.read', 'role', 'Read roles', '["read"]'),
    ('role.manage', 'role', 'Manage roles', '["read", "write", "delete"]'),
    ('employee.read', 'employee', 'Read employees', '["read"]'),
    ('employee.create', 'employee', 'Create employees', '["write"]'),
    ('employee.update', 'employee', 'Update employees', '["write"]'),
    ('employee.delete', 'employee', 'Delete employees', '["delete"]'),
    ('employee.roles.set', 'employee', 'Set employee roles', '["write"]'),
    ('employee.departments.set', 'employee', 'Set employee departments', '["write"]')
ON CONFLICT (name) DO NOTHING;

-- Insert default roles
INSERT INTO roles (role_name, description, department_id, hierarchy_level) VALUES
    ('Super Admin', 'Super Administrator with full access', 1, 1),
    ('Admin', 'Administrator with management access', 1, 2),
    ('Manager', 'Department Manager', 1, 3),
    ('Employee', 'Regular Employee', 1, 4)
ON CONFLICT (role_name) DO NOTHING;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for users with their roles and departments
CREATE OR REPLACE VIEW users_with_roles_departments AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.created_at,
    u.updated_at,
    ARRAY_AGG(DISTINCT r.role_name) FILTER (WHERE r.role_name IS NOT NULL) as roles,
    ARRAY_AGG(DISTINCT d.name) FILTER (WHERE d.name IS NOT NULL) as departments
FROM users u
LEFT JOIN "UserRoles" ur ON u.id = ur."UserId"
LEFT JOIN roles r ON ur."RoleId" = r.id
LEFT JOIN "UserDepartments" ud ON u.id = ud."UserId"
LEFT JOIN departments d ON ud."DepartmentId" = d.id
GROUP BY u.id, u.username, u.email, u.created_at, u.updated_at;

-- View for roles with department information
CREATE OR REPLACE VIEW roles_with_departments AS
SELECT 
    r.id,
    r.role_name,
    r.description,
    r.hierarchy_level,
    r.parent_role_id,
    r.created_at,
    r.updated_at,
    d.id as department_id,
    d.name as department_name,
    d.description as department_description
FROM roles r
JOIN departments d ON r.department_id = d.id;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'User accounts for authentication and employee management';
COMMENT ON TABLE departments IS 'Organizational departments';
COMMENT ON TABLE roles IS 'User roles with department associations';
COMMENT ON TABLE scopes IS 'Permission scopes for access control';
COMMENT ON TABLE role_scopes IS 'Many-to-many relationship between roles and scopes';
COMMENT ON TABLE department_scopes IS 'Many-to-many relationship between departments and scopes';
COMMENT ON TABLE employee_scopes IS 'Many-to-many relationship between users and scopes';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created successfully
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'departments', 'roles', 'scopes', 'role_scopes', 'department_scopes', 'employee_scopes', 'UserRoles', 'UserDepartments')
ORDER BY table_name;

-- Check sample data
SELECT 'departments' as table_name, COUNT(*) as count FROM departments
UNION ALL
SELECT 'scopes' as table_name, COUNT(*) as count FROM scopes
UNION ALL
SELECT 'roles' as table_name, COUNT(*) as count FROM roles;
