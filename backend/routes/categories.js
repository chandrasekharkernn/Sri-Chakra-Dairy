const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await db.getRows(
      'SELECT id, name, description, color, created_at FROM categories ORDER BY name'
    );

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error while fetching categories' });
  }
});

// Get a specific category
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await db.getRow(
      'SELECT id, name, description, color, created_at FROM categories WHERE id = $1',
      [id]
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Server error while fetching category' });
  }
});

// Create a new category (admin only - simplified for demo)
router.post('/', auth, [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().isString(),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex color')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, color } = req.body;

    // Check if category already exists
    const existingCategory = await db.getRow(
      'SELECT id FROM categories WHERE name = $1',
      [name]
    );

    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }

    // Create category
    const newCategory = await db.getRow(`
      INSERT INTO categories (name, description, color)
      VALUES ($1, $2, $3)
      RETURNING id, name, description, color, created_at
    `, [name, description, color || '#3B82F6']);

    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Server error while creating category' });
  }
});

// Update a category
router.put('/:id', auth, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().isString(),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color must be a valid hex color')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, color } = req.body;

    // Check if category exists
    const existingCategory = await db.getRow(
      'SELECT id FROM categories WHERE id = $1',
      [id]
    );

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if name already exists (if updating name)
    if (name) {
      const nameExists = await db.getRow(
        'SELECT id FROM categories WHERE name = $1 AND id != $2',
        [name, id]
      );

      if (nameExists) {
        return res.status(400).json({ error: 'Category with this name already exists' });
      }
    }

    // Update category
    const updatedCategory = await db.getRow(`
      UPDATE categories 
      SET name = COALESCE($1, name), 
          description = $2, 
          color = COALESCE($3, color)
      WHERE id = $4
      RETURNING id, name, description, color, created_at
    `, [name, description, color, id]);

    res.json({
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Server error while updating category' });
  }
});

// Delete a category
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category is being used by any entries
    const usageCount = await db.getRow(
      'SELECT COUNT(*) as count FROM entry_categories WHERE category_id = $1',
      [id]
    );

    if (parseInt(usageCount.count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category that is being used by entries' 
      });
    }

    const result = await db.execute(
      'DELETE FROM categories WHERE id = $1',
      [id]
    );

    if (result === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Server error while deleting category' });
  }
});

// Get categories with entry counts
router.get('/stats/usage', async (req, res) => {
  try {
    const categoriesWithCounts = await db.getRows(`
      SELECT 
        c.id, 
        c.name, 
        c.description, 
        c.color, 
        c.created_at,
        COUNT(ec.entry_id) as entry_count
      FROM categories c
      LEFT JOIN entry_categories ec ON c.id = ec.category_id
      GROUP BY c.id, c.name, c.description, c.color, c.created_at
      ORDER BY entry_count DESC, c.name
    `);

    res.json({ categories: categoriesWithCounts });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({ error: 'Server error while fetching category statistics' });
  }
});

module.exports = router;
