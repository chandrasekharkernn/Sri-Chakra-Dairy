const { DataTypes } = require('sequelize');
const sequelize = require('./database'); // Import the centralized sequelize instance

const DepartmentScope = sequelize.define('DepartmentScope', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'departments',
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
  tableName: 'department_scopes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = DepartmentScope;
