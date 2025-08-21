const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

const WaitingTankerData = sequelize.define('WaitingTankerData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  particulars: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  qty_ltr: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  qty_kg: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  avg_fat: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  clr: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  avg_snf: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  kg_fat: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  kg_snf: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  entry_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  created_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'waiting_tanker_data',
  timestamps: true,
  createdAt: 'created_date',
  updatedAt: 'updated_date'
});

  return WaitingTankerData;
};
