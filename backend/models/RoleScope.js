const { DataTypes } = require('sequelize');
const sequelize = require('./database'); // Import the centralized sequelize instance

const RoleScope = sequelize.define('RoleScope', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
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
  tableName: 'role_scopes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = RoleScope;
