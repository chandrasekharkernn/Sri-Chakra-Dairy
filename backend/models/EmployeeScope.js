const { DataTypes } = require('sequelize');
const sequelize = require('./database'); // Import the centralized sequelize instance

const EmployeeScope = sequelize.define('EmployeeScope', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  scope_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'scopes',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'employee_scopes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = EmployeeScope;
