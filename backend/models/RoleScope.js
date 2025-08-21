const { DataTypes } = require('sequelize');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://localhost:5432/sri_chakra_diary', {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

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
