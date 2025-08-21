# Sri Chakra Diary - Full Stack Application

A complete full-stack application built with modern technologies for managing personal diary entries.

## 🚀 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Package Manager**: npm

## 📁 Project Structure

```
sri-chakra-diary/
├── frontend/          # React + Vite application
├── backend/           # Node.js + Express server
├── database/          # PostgreSQL scripts and migrations
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Database Setup
```bash
# Create PostgreSQL database
createdb sri_chakra_diary

# Run database migrations
cd database
psql -d sri_chakra_diary -f init.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌐 API Endpoints

- `GET /api/entries` - Get all diary entries
- `POST /api/entries` - Create new diary entry
- `GET /api/entries/:id` - Get specific entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

## 📝 Features

- Create, read, update, delete diary entries
- Rich text editor for entries
- Search and filter functionality
- Responsive design
- Real-time updates

## 🔧 Environment Variables

Create `.env` files in both frontend and backend directories:

### Backend (.env)
```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/sri_chakra_diary
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

1. Start the database
2. Start the backend: `cd backend && npm run dev`
3. Start the frontend: `cd frontend && npm run dev`
4. Open http://localhost:5173 in your browser

## 📄 License

MIT License
