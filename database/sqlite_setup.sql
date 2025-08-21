-- SQLite Database Setup for Sri Chakra Diary
-- This script creates all necessary tables for the authentication and management system

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (for authentication and employee management)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    manager_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT UNIQUE NOT NULL,
    description TEXT,
    department_id INTEGER NOT NULL,
    hierarchy_level INTEGER DEFAULT 999,
    parent_role_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- Scopes table (for permissions)
CREATE TABLE IF NOT EXISTS scopes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    permissions TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- JUNCTION TABLES (Many-to-Many Relationships)
-- =====================================================

-- User-Role relationship
CREATE TABLE IF NOT EXISTS UserRoles (
    UserId INTEGER NOT NULL,
    RoleId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES roles(id) ON DELETE CASCADE
);

-- User-Department relationship
CREATE TABLE IF NOT EXISTS UserDepartments (
    UserId INTEGER NOT NULL,
    DepartmentId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserId, DepartmentId),
    FOREIGN KEY (UserId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (DepartmentId) REFERENCES departments(id) ON DELETE CASCADE
);

-- Role-Scope relationship
CREATE TABLE IF NOT EXISTS role_scopes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER NOT NULL,
    scope_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, scope_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (scope_id) REFERENCES scopes(id) ON DELETE CASCADE
);

-- Department-Scope relationship
CREATE TABLE IF NOT EXISTS department_scopes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_id INTEGER NOT NULL,
    scope_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(department_id, scope_id),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (scope_id) REFERENCES scopes(id) ON DELETE CASCADE
);

-- Employee-Scope relationship
CREATE TABLE IF NOT EXISTS employee_scopes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    scope_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, scope_id),
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scope_id) REFERENCES scopes(id) ON DELETE CASCADE
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
-- SAMPLE DATA
-- =====================================================

-- Insert default departments
INSERT OR IGNORE INTO departments (name, description) VALUES
    ('IT Department', 'Information Technology and Systems'),
    ('HR Department', 'Human Resources and Administration'),
    ('Finance Department', 'Finance and Accounting'),
    ('Operations Department', 'Business Operations and Management');

-- Insert default scopes
INSERT OR IGNORE INTO scopes (name, type, description, permissions) VALUES
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
    ('employee.departments.set', 'employee', 'Set employee departments', '["write"]');

-- Insert default roles
INSERT OR IGNORE INTO roles (role_name, description, department_id, hierarchy_level) VALUES
    ('Super Admin', 'Super Administrator with full access', 1, 1),
    ('Admin', 'Administrator with management access', 1, 2),
    ('Manager', 'Department Manager', 1, 3),
    ('Employee', 'Regular Employee', 1, 4);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created successfully
SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users', 'departments', 'roles', 'scopes', 'role_scopes', 'department_scopes', 'employee_scopes', 'UserRoles', 'UserDepartments') ORDER BY name;

-- Check sample data
SELECT 'departments' as table_name, COUNT(*) as count FROM departments
UNION ALL
SELECT 'scopes' as table_name, COUNT(*) as count FROM scopes
UNION ALL
SELECT 'roles' as table_name, COUNT(*) as count FROM roles;
