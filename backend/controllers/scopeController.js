const { Scopes, RoleScopes, DepartmentScopes, EmployeeScopes } =  require('../models');

// Create a new scope
const createScope = async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) {
    return res.status(400).json({ message: 'Scope name and type are required' });
  }

  try {
    const scope = await Scopes.create({ name, type });
    res.status(201).json(scope);
  } catch (err) {
    res.status(500).json({ message: 'Error creating scope', error: err.message });
  }
};






// Get scopes by role ID
const getScopesByRole = async (req, res) => {
  const { id } = req.params;
  try {
    const scopes = await RoleScopes.findAll({
      where: { role_id: id },
      include: [{ model: Scopes, as: 'scope' }]
    });

    res.status(200).json(scopes.map(rs => rs.scope));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching scopes for role', error: err.message });
  }
};

// Get scopes by department ID
const getScopesByDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const scopes = await DepartmentScopes.findAll({
      where: { department_id: id },
      include: [{ model: Scopes, as: 'scope' }]
    });

    res.status(200).json(scopes.map(ds => ds.scope));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching scopes for department', error: err.message });
  }
};

// Get scopes by employee ID
const getScopesByEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const scopes = await EmployeeScopes.findAll({
      where: { employee_id: id },
      include: [{ model: Scopes, as: 'scope' }]
    });

    res.status(200).json(scopes.map(es => es.scope));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching scopes for employee', error: err.message });
  }
};



// List all scopes
const listScopes = async (req, res) => {
  try {
    const scopes = await Scopes.findAll();
    res.status(200).json(scopes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching scopes', error: err.message });
  }
};

// Assign scope to role
const assignScopeToRole = async (req, res) => {
  const { role_id, scope_id } = req.body;
  if (!role_id || !scope_id) {
    return res.status(400).json({ message: 'role_id and scope_id are required' });
  }

  try {
    const assignment = await RoleScopes.create({ role_id, scope_id });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Error assigning scope to role', error: err.message });
  }
};

// Assign scope to department
const assignScopeToDepartment = async (req, res) => {
  const { department_id, scope_id } = req.body;
  if (!department_id || !scope_id) {
    return res.status(400).json({ message: 'department_id and scope_id are required' });
  }

  try {
    const assignment = await DepartmentScopes.create({ department_id, scope_id });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Error assigning scope to department', error: err.message });
  }
};

// Assign scope to employee
const assignScopeToEmployee = async (req, res) => {
  const { employee_id, scope_id } = req.body;
  if (!employee_id || !scope_id) {
    return res.status(400).json({ message: 'employee_id and scope_id are required' });
  }

  try {
    const assignment = await EmployeeScopes.create({ employee_id, scope_id });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Error assigning scope to employee', error: err.message });
  }
};

module.exports = {
  createScope,
  listScopes,
  assignScopeToRole,
  assignScopeToDepartment,
  assignScopeToEmployee,
  getScopesByRole,
  getScopesByDepartment,
  getScopesByEmployee
};
