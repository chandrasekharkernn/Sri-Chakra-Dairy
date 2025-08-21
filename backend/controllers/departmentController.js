//console.log('Models available:', Object.keys(require('../../models')));
const db = require('../models'); // ✅ go up one level to backend/models
const { Departments } = require('../models');



// Create department
const createDepartment = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const dept = await Departments.create({ name, description });
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ message: 'Error creating department', error: err.message });
  }
};




// Update department
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const dept = await Departments.findByPk(id);
    if (!dept) return res.status(404).json({ message: 'Department not found' });

    await dept.update({ name, description });
    res.status(200).json({ message: 'Department updated', dept });
  } catch (err) {
    res.status(500).json({ message: 'Error updating department', error: err.message });
  }
};

// Delete department
const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const dept = await Departments.findByPk(id);
    if (!dept) return res.status(404).json({ message: 'Department not found' });

    await dept.destroy();
    res.status(200).json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting department', error: err.message });
  }
};




// List departments
const listDepartments = async (req, res) => {
  try {
    const departments = await Departments.findAll();
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching departments', error: err.message });
  }
};

module.exports = {
  createDepartment,
  listDepartments,
  updateDepartment,
  deleteDepartment
};
