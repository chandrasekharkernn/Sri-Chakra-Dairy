# Database Setup Guide

This guide will help you set up the PostgreSQL database for the Sri Chakra Diary application.

## Prerequisites

1. **PostgreSQL** - Make sure PostgreSQL is installed on your system
2. **psql command line tool** - Should be included with PostgreSQL installation

## Installation Options

### Option 1: Automated Setup (Recommended)

#### For Windows Users:
```bash
# Navigate to the database directory
cd database

# Run the Windows batch file
setup_database.bat
```

#### For macOS/Linux Users:
```bash
# Navigate to the database directory
cd database

# Make the script executable
chmod +x setup_database.sh

# Run the setup script
./setup_database.sh
```

### Option 2: Manual Setup

If you prefer to set up the database manually, follow these steps:

#### 1. Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the password you set for the postgres user

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 2. Create Database

```bash
# Connect to PostgreSQL as postgres user
psql -U postgres

# Create the database
CREATE DATABASE sri_chakra_diary;

# Connect to the new database
\c sri_chakra_diary

# Exit psql
\q
```

#### 3. Run the Setup Script

```bash
# Navigate to the database directory
cd database

# Run the SQL setup script
psql -U postgres -d sri_chakra_diary -f sequelize_setup.sql
```

#### 4. Create Environment File

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/sri_chakra_diary

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=info

# Super Admin IDs (comma-separated)
SUPER_ADMIN_IDS=1,2,3
```

## Database Schema

The setup script creates the following tables:

### Core Tables
- **`users`** - User accounts for authentication
- **`departments`** - Organizational departments
- **`roles`** - User roles with department associations
- **`scopes`** - Permission scopes for access control

### Junction Tables
- **`UserRoles`** - Many-to-many relationship between users and roles
- **`UserDepartments`** - Many-to-many relationship between users and departments
- **`role_scopes`** - Many-to-many relationship between roles and scopes
- **`department_scopes`** - Many-to-many relationship between departments and scopes
- **`employee_scopes`** - Many-to-many relationship between users and scopes

### Sample Data

The setup script includes sample data:
- 4 default departments (IT, HR, Finance, Operations)
- 13 default scopes (permissions)
- 4 default roles (Super Admin, Admin, Manager, Employee)

## Verification

After setup, you can verify the installation:

```bash
# Connect to the database
psql -U postgres -d sri_chakra_diary

# Check tables
\dt

# Check sample data
SELECT 'departments' as table_name, COUNT(*) as count FROM departments
UNION ALL
SELECT 'scopes' as table_name, COUNT(*) as count FROM scopes
UNION ALL
SELECT 'roles' as table_name, COUNT(*) as count FROM roles;

# Exit
\q
```

## Troubleshooting

### Common Issues

1. **PostgreSQL not found**
   - Make sure PostgreSQL is installed
   - Add PostgreSQL bin directory to your PATH

2. **Connection refused**
   - Check if PostgreSQL service is running
   - Verify host, port, and credentials

3. **Permission denied**
   - Make sure you're using the correct username and password
   - Check if the user has permission to create databases

4. **Database already exists**
   - The script will handle this automatically
   - You can drop the database first if needed: `DROP DATABASE sri_chakra_diary;`

### Windows Specific

1. **psql not found**
   - Add PostgreSQL bin directory to PATH
   - Usually: `C:\Program Files\PostgreSQL\[version]\bin`

2. **Permission issues**
   - Run Command Prompt as Administrator
   - Check Windows Firewall settings

### macOS/Linux Specific

1. **psql command not found**
   - Install PostgreSQL: `brew install postgresql` (macOS)
   - Start service: `brew services start postgresql`

2. **Permission denied**
   - Use `sudo` if needed
   - Check file permissions: `chmod +x setup_database.sh`

## Next Steps

After successful database setup:

1. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the backend server:**
   ```bash
   npm run dev
   ```

3. **Test the API endpoints:**
   - Health check: `GET http://localhost:5000/health`
   - API base: `http://localhost:5000/api`

## Environment Variables

Make sure your `.env` file contains:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-here` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` |
| `SUPER_ADMIN_IDS` | Comma-separated super admin user IDs | `1,2,3` |

## Security Notes

1. **Change the JWT_SECRET** - Use a strong, random string
2. **Use strong passwords** - For both PostgreSQL and application users
3. **Limit database access** - Only grant necessary permissions
4. **Regular backups** - Set up automated database backups
5. **Environment separation** - Use different databases for dev/staging/prod

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify PostgreSQL installation and configuration
3. Check the application logs for detailed error messages
4. Ensure all environment variables are correctly set
