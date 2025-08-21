# Sri Chakra Diary - Setup Guide

This guide will help you set up the complete full-stack diary application.

## Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## Quick Setup

### 1. Database Setup

First, create the PostgreSQL database:

```bash
# Create the database
createdb sri_chakra_diary

# Run the initialization script
psql -d sri_chakra_diary -f database/init.sql
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your database credentials
# Update DATABASE_URL with your PostgreSQL connection string
# Example: DATABASE_URL=postgresql://username:password@localhost:5432/sri_chakra_diary

# Start the development server
npm run dev
```

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Start the development server
npm run dev
```

## Environment Configuration

### Backend (.env)
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/sri_chakra_diary
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Sri Chakra Diary
VITE_APP_VERSION=1.0.0
```

## Running the Application

1. **Start PostgreSQL** (if not running as a service)
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `cd frontend && npm run dev`
4. **Open Browser**: Navigate to http://localhost:5173

## Features

### ✅ Implemented Features
- User authentication (register/login)
- Create, read, update, delete diary entries
- Search and filter entries
- Category management
- Private/public entries
- Responsive design
- Modern UI with Tailwind CSS

### 🔧 Technical Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Authentication**: JWT tokens
- **Database**: PostgreSQL with proper relationships
- **Styling**: Tailwind CSS with custom components

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Entries
- `GET /api/entries` - Get all entries (with pagination, search, filters)
- `POST /api/entries` - Create new entry
- `GET /api/entries/:id` - Get specific entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Database Schema

The application uses the following main tables:
- `users` - User accounts
- `diary_entries` - Diary entries
- `categories` - Entry categories
- `entry_categories` - Many-to-many relationship

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in backend .env file
   - Verify database exists: `createdb sri_chakra_diary`

2. **Port Already in Use**
   - Backend: Change PORT in backend .env
   - Frontend: Change port in vite.config.js

3. **CORS Errors**
   - Ensure FRONTEND_URL in backend .env matches frontend URL
   - Check that both servers are running

4. **JWT Errors**
   - Ensure JWT_SECRET is set in backend .env
   - Clear browser localStorage if needed

### Development Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm run start        # Start production server
npm test            # Run tests

# Frontend
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use a production PostgreSQL database
3. Set a strong JWT_SECRET
4. Configure proper CORS settings

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update VITE_API_URL to point to your production backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.
