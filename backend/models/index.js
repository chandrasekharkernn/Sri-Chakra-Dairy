const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use Supabase database URL with correct password
const databaseUrl = 'postgresql://postgres:S3@@@1303@db.yrakjnonabrqyicyvdam.supabase.co:5432/postgres';

// Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Import models
const User = require('./User');
const Department = require('./Department');
const Role = require('./Role');
const Scope = require('./Scope');
const RoleScope = require('./RoleScope');
const DepartmentScope = require('./DepartmentScope');
const EmployeeScope = require('./EmployeeScope');

// Import data models
const SalesDataFactory = require('./SalesData');
const OtherDairySalesDataFactory = require('./OtherDairySalesData');
const ProductsDataFactory = require('./ProductsData');
const SiloClosingBalanceDataFactory = require('./SiloClosingBalanceData');
const ProductsClosingStockDataFactory = require('./ProductsClosingStockData');
const WaitingTankerDataFactory = require('./WaitingTankerData');
const ThirdPartyProcurementDataFactory = require('./ThirdPartyProcurementData');
const OpeningStockDataFactory = require('./OpeningStockData');

// Initialize data models
const SalesData = SalesDataFactory(sequelize);
const OtherDairySalesData = OtherDairySalesDataFactory(sequelize);
const ProductsData = ProductsDataFactory(sequelize);
const SiloClosingBalanceData = SiloClosingBalanceDataFactory(sequelize);
const ProductsClosingStockData = ProductsClosingStockDataFactory(sequelize);
const WaitingTankerData = WaitingTankerDataFactory(sequelize);
const ThirdPartyProcurementData = ThirdPartyProcurementDataFactory(sequelize);
const OpeningStockData = OpeningStockDataFactory(sequelize);

// Define associations
User.belongsToMany(Role, { through: 'UserRoles', as: 'roles' });
Role.belongsToMany(User, { through: 'UserRoles', as: 'users' });

User.belongsToMany(Department, { through: 'UserDepartments', as: 'departments' });
Department.belongsToMany(User, { through: 'UserDepartments', as: 'users' });

Role.belongsTo(Department, { as: 'department', foreignKey: 'departmentId' });
Department.hasMany(Role, { as: 'roles', foreignKey: 'departmentId' });

Role.belongsTo(Role, { as: 'parentRole', foreignKey: 'parent_role_id' });
Role.hasMany(Role, { as: 'childRoles', foreignKey: 'parent_role_id' });

// Define data model associations
User.hasMany(SalesData, { foreignKey: 'user_id', as: 'salesData' });
SalesData.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(OtherDairySalesData, { foreignKey: 'user_id', as: 'otherDairySalesData' });
OtherDairySalesData.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(ProductsData, { foreignKey: 'user_id', as: 'productsData' });
ProductsData.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(SiloClosingBalanceData, { foreignKey: 'user_id', as: 'siloClosingBalanceData' });
SiloClosingBalanceData.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(ProductsClosingStockData, { foreignKey: 'user_id', as: 'productsClosingStockData' });
ProductsClosingStockData.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(WaitingTankerData, { foreignKey: 'user_id', as: 'waitingTankerData' });
WaitingTankerData.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(ThirdPartyProcurementData, { foreignKey: 'user_id', as: 'thirdPartyProcurementData' });
ThirdPartyProcurementData.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(OpeningStockData, { foreignKey: 'user_id', as: 'openingStockData' });
OpeningStockData.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Department,
  Role,
  Scope,
  RoleScope,
  DepartmentScope,
  EmployeeScope,
  SalesData,
  OtherDairySalesData,
  ProductsData,
  SiloClosingBalanceData,
  ProductsClosingStockData,
  WaitingTankerData,
  ThirdPartyProcurementData,
  OpeningStockData,
  Departments: Department, // Alias for compatibility
  Users: User, // Alias for compatibility
  Scopes: Scope, // Alias for compatibility
  RoleScopes: RoleScope, // Alias for compatibility
  DepartmentScopes: DepartmentScope, // Alias for compatibility
  EmployeeScopes: EmployeeScope // Alias for compatibility
};
