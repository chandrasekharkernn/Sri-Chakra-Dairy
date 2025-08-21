#!/bin/bash

# Database Setup Script for Sri Chakra Diary
# This script helps you set up the PostgreSQL database

echo "🚀 Setting up database for Sri Chakra Diary..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if PostgreSQL is installed
check_postgres() {
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL is not installed or not in PATH"
        echo "Please install PostgreSQL first:"
        echo "  - Windows: Download from https://www.postgresql.org/download/windows/"
        echo "  - macOS: brew install postgresql"
        echo "  - Ubuntu: sudo apt-get install postgresql postgresql-contrib"
        exit 1
    fi
    print_success "PostgreSQL is installed"
}

# Get database connection details
get_db_config() {
    echo ""
    print_status "Database Configuration"
    echo "=========================="
    
    # Default values
    DB_HOST=${DB_HOST:-"localhost"}
    DB_PORT=${DB_PORT:-"5432"}
    DB_NAME=${DB_NAME:-"sri_chakra_diary"}
    DB_USER=${DB_USER:-"postgres"}
    
    # Prompt for values
    read -p "Database host [$DB_HOST]: " input_host
    DB_HOST=${input_host:-$DB_HOST}
    
    read -p "Database port [$DB_PORT]: " input_port
    DB_PORT=${input_port:-$DB_PORT}
    
    read -p "Database name [$DB_NAME]: " input_name
    DB_NAME=${input_name:-$DB_NAME}
    
    read -p "Database user [$DB_USER]: " input_user
    DB_USER=${input_user:-$DB_USER}
    
    read -s -p "Database password: " DB_PASSWORD
    echo ""
    
    # Set environment variables
    export PGPASSWORD=$DB_PASSWORD
    export DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
}

# Test database connection
test_connection() {
    print_status "Testing database connection..."
    
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" &> /dev/null; then
        print_success "Database connection successful"
        return 0
    else
        print_error "Database connection failed"
        return 1
    fi
}

# Create database if it doesn't exist
create_database() {
    print_status "Checking if database exists..."
    
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" &> /dev/null; then
        print_success "Database '$DB_NAME' already exists"
    else
        print_status "Creating database '$DB_NAME'..."
        
        # Connect to postgres database to create new database
        if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "postgres" -c "CREATE DATABASE \"$DB_NAME\";" &> /dev/null; then
            print_success "Database '$DB_NAME' created successfully"
        else
            print_error "Failed to create database '$DB_NAME'"
            exit 1
        fi
    fi
}

# Run the SQL setup script
run_setup_script() {
    print_status "Running database setup script..."
    
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "sequelize_setup.sql"; then
        print_success "Database setup completed successfully"
    else
        print_error "Database setup failed"
        exit 1
    fi
}

# Create .env file for backend
create_env_file() {
    print_status "Creating .env file for backend..."
    
    cat > "../backend/.env" << EOF
# Database Configuration
DATABASE_URL=$DATABASE_URL

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
EOF

    print_success ".env file created at ../backend/.env"
    print_warning "Please update JWT_SECRET with a secure random string"
}

# Verify setup
verify_setup() {
    print_status "Verifying database setup..."
    
    # Check tables
    echo "Checking tables..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('users', 'departments', 'roles', 'scopes', 'role_scopes', 'department_scopes', 'employee_scopes', 'UserRoles', 'UserDepartments')
    ORDER BY table_name;
    "
    
    # Check sample data
    echo ""
    echo "Checking sample data..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 'departments' as table_name, COUNT(*) as count FROM departments
    UNION ALL
    SELECT 'scopes' as table_name, COUNT(*) as count FROM scopes
    UNION ALL
    SELECT 'roles' as table_name, COUNT(*) as count FROM roles;
    "
}

# Main execution
main() {
    echo "=========================================="
    echo "  Sri Chakra Diary Database Setup"
    echo "=========================================="
    
    # Check prerequisites
    check_postgres
    
    # Get configuration
    get_db_config
    
    # Test connection
    if ! test_connection; then
        print_error "Cannot proceed without database connection"
        exit 1
    fi
    
    # Create database
    create_database
    
    # Run setup script
    run_setup_script
    
    # Create .env file
    create_env_file
    
    # Verify setup
    verify_setup
    
    echo ""
    print_success "Database setup completed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Install backend dependencies: cd backend && npm install"
    echo "2. Start the backend server: npm run dev"
    echo "3. Test the API endpoints"
    echo ""
    echo "Database URL: $DATABASE_URL"
}

# Run main function
main "$@"
