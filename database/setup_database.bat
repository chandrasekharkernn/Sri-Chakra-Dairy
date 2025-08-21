@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo   Sri Chakra Diary Database Setup
echo ==========================================

:: Check if PostgreSQL is installed
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL first:
    echo   - Download from https://www.postgresql.org/download/windows/
    echo   - Add PostgreSQL bin directory to your PATH
    pause
    exit /b 1
)
echo [SUCCESS] PostgreSQL is installed

:: Get database configuration
echo.
echo [INFO] Database Configuration
echo ==========================

set /p DB_HOST="Database host [localhost]: "
if "!DB_HOST!"=="" set DB_HOST=localhost

set /p DB_PORT="Database port [5432]: "
if "!DB_PORT!"=="" set DB_PORT=5432

set /p DB_NAME="Database name [sri_chakra_diary]: "
if "!DB_NAME!"=="" set DB_NAME=sri_chakra_diary

set /p DB_USER="Database user [postgres]: "
if "!DB_USER!"=="" set DB_USER=postgres

set /p DB_PASSWORD="Database password: "

:: Set environment variables
set PGPASSWORD=!DB_PASSWORD!
set DATABASE_URL=postgresql://!DB_USER!:!DB_PASSWORD!@!DB_HOST!:!DB_PORT!/!DB_NAME!

:: Test database connection
echo [INFO] Testing database connection...
psql -h "!DB_HOST!" -p "!DB_PORT!" -U "!DB_USER!" -d "!DB_NAME!" -c "SELECT 1;" >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Database connection failed
    pause
    exit /b 1
)
echo [SUCCESS] Database connection successful

:: Create database if it doesn't exist
echo [INFO] Checking if database exists...
psql -h "!DB_HOST!" -p "!DB_PORT!" -U "!DB_USER!" -d "!DB_NAME!" -c "SELECT 1;" >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Creating database '!DB_NAME!'...
    psql -h "!DB_HOST!" -p "!DB_PORT!" -U "!DB_USER!" -d "postgres" -c "CREATE DATABASE \"!DB_NAME!\";" >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create database '!DB_NAME!'
        pause
        exit /b 1
    )
    echo [SUCCESS] Database '!DB_NAME!' created successfully
) else (
    echo [SUCCESS] Database '!DB_NAME!' already exists
)

:: Run the SQL setup script
echo [INFO] Running database setup script...
psql -h "!DB_HOST!" -p "!DB_PORT!" -U "!DB_USER!" -d "!DB_NAME!" -f "sequelize_setup.sql"
if %errorlevel% neq 0 (
    echo [ERROR] Database setup failed
    pause
    exit /b 1
)
echo [SUCCESS] Database setup completed successfully

:: Create .env file for backend
echo [INFO] Creating .env file for backend...
(
echo # Database Configuration
echo DATABASE_URL=!DATABASE_URL!
echo.
echo # Server Configuration
echo PORT=5000
echo NODE_ENV=development
echo.
echo # JWT Configuration
echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
echo.
echo # Frontend URL
echo FRONTEND_URL=http://localhost:5173
echo.
echo # Logging
echo LOG_LEVEL=info
echo.
echo # Super Admin IDs ^(comma-separated^)
echo SUPER_ADMIN_IDS=1,2,3
) > "..\backend\.env"

echo [SUCCESS] .env file created at ..\backend\.env
echo [WARNING] Please update JWT_SECRET with a secure random string

:: Verify setup
echo [INFO] Verifying database setup...
echo Checking tables...
psql -h "!DB_HOST!" -p "!DB_PORT!" -U "!DB_USER!" -d "!DB_NAME!" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'departments', 'roles', 'scopes', 'role_scopes', 'department_scopes', 'employee_scopes', 'UserRoles', 'UserDepartments') ORDER BY table_name;"

echo.
echo Checking sample data...
psql -h "!DB_HOST!" -p "!DB_PORT!" -U "!DB_USER!" -d "!DB_NAME!" -c "SELECT 'departments' as table_name, COUNT(*) as count FROM departments UNION ALL SELECT 'scopes' as table_name, COUNT(*) as count FROM scopes UNION ALL SELECT 'roles' as table_name, COUNT(*) as count FROM roles;"

echo.
echo [SUCCESS] Database setup completed successfully! 🎉
echo.
echo Next steps:
echo 1. Install backend dependencies: cd backend ^&^& npm install
echo 2. Start the backend server: npm run dev
echo 3. Test the API endpoints
echo.
echo Database URL: !DATABASE_URL!
echo.
pause
