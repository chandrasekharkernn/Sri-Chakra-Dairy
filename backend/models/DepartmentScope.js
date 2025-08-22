const { DataTypes } = require('sequelize');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('postgresql://postgres:S3@@@1303@db.yrakjnonabrqyicyvdam.supabase.co:5432/postgres', {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

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
