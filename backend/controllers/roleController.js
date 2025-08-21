// controllers/roleController.js
const { Role, Departments } = require('../models');

// CREATE
const createRole = async (req, res) => {
  try {
    const { role_name, departmentId, hierarchy_level, parent_role_id } = req.body;
    if (!role_name || departmentId == null) {
      return res.status(400).json({ message: 'role_name and departmentId are required' });
    }

    const dept = await Departments.findByPk(departmentId);
    if (!dept) return res.status(400).json({ message: 'Invalid departmentId' });

    const role = await Role.create({
      role_name,
      departmentId,          // maps to department_id via model field
      hierarchy_level,       // optional (defaults to 999)
      parent_role_id         // optional
    });

    return res.status(201).json(role);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating role', error: err.message });
  }
};

// UPDATE
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name, departmentId, hierarchy_level, parent_role_id } = req.body;

    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    if (departmentId != null) {
      const dept = await Departments.findByPk(departmentId);
      if (!dept) return res.status(400).json({ message: 'Invalid departmentId' });
    }

    await role.update({ role_name, departmentId, hierarchy_level, parent_role_id });
    return res.status(200).json({ message: 'Role updated', role });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating role', error: err.message });
  }
};

// DELETE
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    await role.destroy();
    return res.status(200).json({ message: 'Role deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting role', error: err.message });
  }
};

// LIST
const listRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({ include: [{ model: Departments, as: 'department' }] });
    return res.status(200).json(roles);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching roles', error: err.message });
  }
};

module.exports = { createRole, listRoles, updateRole, deleteRole };
