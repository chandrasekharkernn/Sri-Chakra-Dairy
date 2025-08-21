const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all entries for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, sort = 'created_at', order = 'desc' } = req.query;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        de.id, de.title, de.content, de.mood, de.tags, de.is_private, 
        de.created_at, de.updated_at,
        array_agg(c.name) FILTER (WHERE c.name IS NOT NULL) as categories
      FROM diary_entries de
      LEFT JOIN entry_categories ec ON de.id = ec.entry_id
      LEFT JOIN categories c ON ec.category_id = c.id
      WHERE de.user_id = $1
    `;
    
    const queryParams = [userId];
    let paramCount = 1;

    // Add search filter
    if (search) {
      paramCount++;
      query += ` AND (de.title ILIKE $${paramCount} OR de.content ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Add category filter
    if (category) {
      paramCount++;
      query += ` AND c.name = $${paramCount}`;
      queryParams.push(category);
    }

    query += ` GROUP BY de.id, de.title, de.content, de.mood, de.tags, de.is_private, de.created_at, de.updated_at`;

    // Add sorting
    const validSortFields = ['created_at', 'updated_at', 'title'];
    const validOrders = ['asc', 'desc'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = validOrders.includes(order.toLowerCase()) ? order.toUpperCase() : 'DESC';
    
    query += ` ORDER BY de.${sortField} ${sortOrder}`;
    query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    queryParams.push(parseInt(limit), offset);

    const entries = await db.getRows(query, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(DISTINCT de.id) FROM diary_entries de';
    if (category) {
      countQuery += ' LEFT JOIN entry_categories ec ON de.id = ec.entry_id LEFT JOIN categories c ON ec.category_id = c.id';
    }
    countQuery += ' WHERE de.user_id = $1';
    
    if (search) {
      countQuery += ' AND (de.title ILIKE $2 OR de.content ILIKE $2)';
    }
    if (category) {
      countQuery += search ? ' AND c.name = $3' : ' AND c.name = $2';
    }

    const countParams = [userId];
    if (search) countParams.push(`%${search}%`);
    if (category) countParams.push(category);

    const totalCount = await db.getRow(countQuery, countParams);
    const totalPages = Math.ceil(totalCount.count / limit);

    res.json({
      entries,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalEntries: parseInt(totalCount.count),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ error: 'Server error while fetching entries' });
  }
});

// Get a specific entry
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const entry = await db.getRow(`
      SELECT 
        de.id, de.title, de.content, de.mood, de.tags, de.is_private, 
        de.created_at, de.updated_at,
        array_agg(c.name) FILTER (WHERE c.name IS NOT NULL) as categories
      FROM diary_entries de
      LEFT JOIN entry_categories ec ON de.id = ec.entry_id
      LEFT JOIN categories c ON ec.category_id = c.id
      WHERE de.id = $1 AND de.user_id = $2
      GROUP BY de.id, de.title, de.content, de.mood, de.tags, de.is_private, de.created_at, de.updated_at
    `, [id, userId]);

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ entry });
  } catch (error) {
    console.error('Get entry error:', error);
    res.status(500).json({ error: 'Server error while fetching entry' });
  }
});

// Create a new entry
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('mood').optional().isString(),
  body('tags').optional().isArray(),
  body('is_private').optional().isBoolean(),
  body('categoryIds').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, mood, tags, is_private, categoryIds } = req.body;
    const userId = req.user.id;

    // Create entry
    const newEntry = await db.getRow(`
      INSERT INTO diary_entries (user_id, title, content, mood, tags, is_private)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, content, mood, tags, is_private, created_at, updated_at
    `, [userId, title, content, mood, tags || [], is_private || false]);

    // Add categories if provided
    if (categoryIds && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        await db.execute(
          'INSERT INTO entry_categories (entry_id, category_id) VALUES ($1, $2)',
          [newEntry.id, categoryId]
        );
      }
    }

    // Get entry with categories
    const entryWithCategories = await db.getRow(`
      SELECT 
        de.id, de.title, de.content, de.mood, de.tags, de.is_private, 
        de.created_at, de.updated_at,
        array_agg(c.name) FILTER (WHERE c.name IS NOT NULL) as categories
      FROM diary_entries de
      LEFT JOIN entry_categories ec ON de.id = ec.entry_id
      LEFT JOIN categories c ON ec.category_id = c.id
      WHERE de.id = $1
      GROUP BY de.id, de.title, de.content, de.mood, de.tags, de.is_private, de.created_at, de.updated_at
    `, [newEntry.id]);

    res.status(201).json({
      message: 'Entry created successfully',
      entry: entryWithCategories
    });
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({ error: 'Server error while creating entry' });
  }
});

// Update an entry
router.put('/:id', auth, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  body('mood').optional().isString(),
  body('tags').optional().isArray(),
  body('is_private').optional().isBoolean(),
  body('categoryIds').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content, mood, tags, is_private, categoryIds } = req.body;
    const userId = req.user.id;

    // Check if entry exists and belongs to user
    const existingEntry = await db.getRow(
      'SELECT id FROM diary_entries WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (!existingEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    // Update entry
    const updatedEntry = await db.getRow(`
      UPDATE diary_entries 
      SET title = COALESCE($1, title), 
          content = COALESCE($2, content), 
          mood = $3, 
          tags = $4, 
          is_private = COALESCE($5, is_private),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND user_id = $7
      RETURNING id, title, content, mood, tags, is_private, created_at, updated_at
    `, [title, content, mood, tags, is_private, id, userId]);

    // Update categories if provided
    if (categoryIds !== undefined) {
      // Remove existing categories
      await db.execute('DELETE FROM entry_categories WHERE entry_id = $1', [id]);
      
      // Add new categories
      if (categoryIds.length > 0) {
        for (const categoryId of categoryIds) {
          await db.execute(
            'INSERT INTO entry_categories (entry_id, category_id) VALUES ($1, $2)',
            [id, categoryId]
          );
        }
      }
    }

    // Get updated entry with categories
    const entryWithCategories = await db.getRow(`
      SELECT 
        de.id, de.title, de.content, de.mood, de.tags, de.is_private, 
        de.created_at, de.updated_at,
        array_agg(c.name) FILTER (WHERE c.name IS NOT NULL) as categories
      FROM diary_entries de
      LEFT JOIN entry_categories ec ON de.id = ec.entry_id
      LEFT JOIN categories c ON ec.category_id = c.id
      WHERE de.id = $1
      GROUP BY de.id, de.title, de.content, de.mood, de.tags, de.is_private, de.created_at, de.updated_at
    `, [id]);

    res.json({
      message: 'Entry updated successfully',
      entry: entryWithCategories
    });
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({ error: 'Server error while updating entry' });
  }
});

// Delete an entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await db.execute(
      'DELETE FROM diary_entries WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({ error: 'Server error while deleting entry' });
  }
});

module.exports = router;
