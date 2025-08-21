const { sequelize } = require('../models');
const {
  SalesData,
  OtherDairySalesData,
  ProductsData,
  SiloClosingBalanceData,
  ProductsClosingStockData,
  WaitingTankerData,
  ThirdPartyProcurementData,
  OpeningStockData
} = require('../models');

async function createDataTables() {
  try {
    console.log('Starting database migration for data tables...');
    
    // Sync all models to create tables
    await sequelize.sync({ force: false, alter: true });
    
    console.log('✅ All data tables created successfully!');
    console.log('Created tables:');
    console.log('- sales_data');
    console.log('- other_dairy_sales_data');
    console.log('- products_data');
    console.log('- silo_closing_balance_data');
    console.log('- products_closing_stock_data');
    console.log('- waiting_tanker_data');
    console.log('- third_party_procurement_data');
    console.log('- opening_stock_data');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating data tables:', error);
    process.exit(1);
  }
}

createDataTables();
