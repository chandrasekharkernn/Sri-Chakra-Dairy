-- Sri Chakra Diary Database Initialization
-- PostgreSQL Database Schema

-- Create database (run this command separately)
-- CREATE DATABASE sri_chakra_diary;

-- Connect to the database and run the following:

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create diary entries table
CREATE TABLE IF NOT EXISTS diary_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    mood VARCHAR(50),
    tags TEXT[],
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create entry_categories junction table
CREATE TABLE IF NOT EXISTS entry_categories (
    entry_id INTEGER REFERENCES diary_entries(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (entry_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_id ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_created_at ON diary_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_diary_entries_title ON diary_entries(title);
CREATE INDEX IF NOT EXISTS idx_entry_categories_entry_id ON entry_categories(entry_id);
CREATE INDEX IF NOT EXISTS idx_entry_categories_category_id ON entry_categories(category_id);

-- Insert default categories
INSERT INTO categories (name, description, color) VALUES
    ('Personal', 'Personal thoughts and reflections', '#3B82F6'),
    ('Work', 'Work-related entries', '#10B981'),
    ('Health', 'Health and wellness', '#EF4444'),
    ('Travel', 'Travel experiences', '#F59E0B'),
    ('Learning', 'Learning and education', '#8B5CF6'),
    ('Relationships', 'Family and friends', '#EC4899'),
    ('Goals', 'Goals and aspirations', '#06B6D4')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
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

CREATE TRIGGER update_diary_entries_updated_at BEFORE UPDATE ON diary_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for entries with category information
CREATE OR REPLACE VIEW entries_with_categories AS
SELECT 
    de.id,
    de.user_id,
    de.title,
    de.content,
    de.mood,
    de.tags,
    de.is_private,
    de.created_at,
    de.updated_at,
    array_agg(c.name) FILTER (WHERE c.name IS NOT NULL) as categories
FROM diary_entries de
LEFT JOIN entry_categories ec ON de.id = ec.entry_id
LEFT JOIN categories c ON ec.category_id = c.id
GROUP BY de.id, de.user_id, de.title, de.content, de.mood, de.tags, de.is_private, de.created_at, de.updated_at;

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
