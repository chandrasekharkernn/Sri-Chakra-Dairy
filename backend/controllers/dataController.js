const {
  SalesData,
  OtherDairySalesData,
  ProductsData,
  SiloClosingBalanceData,
  ProductsClosingStockData,
  WaitingTankerData,
  ThirdPartyProcurementData,
  OpeningStockData,
  User
} = require('../models');

// Helper function to validate data
const validateData = (data) => {
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array');
  }
  
  for (const row of data) {
    if (!row.particulars) {
      throw new Error('Particulars is required for all rows');
    }
  }
  
  return true;
};

// Helper function to process data for database
const processDataForDB = (data, userId, entryDate) => {
  return data.map(row => ({
    user_id: userId,
    particulars: row.particulars,
    qty_ltr: row.qtyLtr || null,
    qty_kg: row.qtyKg || null,
    avg_fat: row.avgFat || null,
    clr: row.clr || null,
    avg_snf: row.avgSnf || null,
    kg_fat: row.kgFat || null,
    kg_snf: row.kgSnf || null,
    entry_date: entryDate
  }));
};

// Helper function to process opening stock data for database
const processOpeningStockDataForDB = (data, userId, entryDate) => {
  const processedData = [];
  
  // Process opening stock section
  if (data.openingStockData) {
    data.openingStockData.forEach(row => {
      processedData.push({
        user_id: userId,
        section: 'opening_stock',
        particulars: row.particulars,
        qty_ltr: row.qtyLtr || null,
        qty_kg: row.qtyKg || null,
        avg_fat: row.avgFat || null,
        clr: row.clr || null,
        avg_snf: row.avgSnf || null,
        kg_fat: row.kgFat || null,
        kg_snf: row.kgSnf || null,
        entry_date: entryDate
      });
    });
  }
  
  // Process tanker transaction section
  if (data.tankerData) {
    data.tankerData.forEach(row => {
      processedData.push({
        user_id: userId,
        section: 'tanker_transaction',
        particulars: row.particulars,
        qty_ltr: row.qtyLtr || null,
        qty_kg: row.qtyKg || null,
        avg_fat: row.avgFat || null,
        clr: row.clr || null,
        avg_snf: row.avgSnf || null,
        kg_fat: row.kgFat || null,
        kg_snf: row.kgSnf || null,
        entry_date: entryDate
      });
    });
  }
  
  // Process own procurement section
  if (data.procurementData) {
    data.procurementData.forEach(row => {
      processedData.push({
        user_id: userId,
        section: 'own_procurement',
        particulars: row.particulars,
        qty_ltr: row.qtyLtr || null,
        qty_kg: row.qtyKg || null,
        avg_fat: row.avgFat || null,
        clr: row.clr || null,
        avg_snf: row.avgSnf || null,
        kg_fat: row.kgFat || null,
        kg_snf: row.kgSnf || null,
        entry_date: entryDate
      });
    });
  }
  
  return processedData;
};

// Sales Data Controllers
const saveSalesData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    // Delete existing data for this date and user
    await SalesData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    // Insert new data
    const processedData = processDataForDB(data, userId, entryDate);
    await SalesData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Sales data saved successfully'
    });
  } catch (error) {
    console.error('Error saving sales data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const submitSalesData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    // Delete existing data for this date and user
    await SalesData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    // Insert new data
    const processedData = processDataForDB(data, userId, entryDate);
    await SalesData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Sales data submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting sales data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getSalesDataByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    
    const data = await SalesData.findAll({
      where: {
        user_id: userId,
        entry_date: date
      },
      order: [['id', 'ASC']]
    });
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Other Dairy Sales Data Controllers
const saveOtherDairySalesData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    await OtherDairySalesData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    const processedData = processDataForDB(data, userId, entryDate);
    await OtherDairySalesData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Other dairy sales data saved successfully'
    });
  } catch (error) {
    console.error('Error saving other dairy sales data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const submitOtherDairySalesData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    await OtherDairySalesData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    const processedData = processDataForDB(data, userId, entryDate);
    await OtherDairySalesData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Other dairy sales data submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting other dairy sales data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getOtherDairySalesDataByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    
    const data = await OtherDairySalesData.findAll({
      where: {
        user_id: userId,
        entry_date: date
      },
      order: [['id', 'ASC']]
    });
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching other dairy sales data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Products Data Controllers
const saveProductsData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    await ProductsData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    const processedData = processDataForDB(data, userId, entryDate);
    await ProductsData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Products data saved successfully'
    });
  } catch (error) {
    console.error('Error saving products data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const submitProductsData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    await ProductsData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    const processedData = processDataForDB(data, userId, entryDate);
    await ProductsData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Products data submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting products data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getProductsDataByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    
    const data = await ProductsData.findAll({
      where: {
        user_id: userId,
        entry_date: date
      },
      order: [['id', 'ASC']]
    });
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching products data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Silo Closing Balance Data Controllers
const saveSiloClosingBalanceData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    await SiloClosingBalanceData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    const processedData = processDataForDB(data, userId, entryDate);
    await SiloClosingBalanceData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Silo closing balance data saved successfully'
    });
  } catch (error) {
    console.error('Error saving silo closing balance data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const submitSiloClosingBalanceData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    await SiloClosingBalanceData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    const processedData = processDataForDB(data, userId, entryDate);
    await SiloClosingBalanceData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Silo closing balance data submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting silo closing balance data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getSiloClosingBalanceDataByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    
    const data = await SiloClosingBalanceData.findAll({
      where: {
        user_id: userId,
        entry_date: date
      },
      order: [['id', 'ASC']]
    });
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching silo closing balance data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Products Closing Stock Data Controllers
const saveProductsClosingStockData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    await ProductsClosingStockData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    const processedData = processDataForDB(data, userId, entryDate);
    await ProductsClosingStockData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Products closing stock data saved successfully'
    });
  } catch (error) {
    console.error('Error saving products closing stock data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const submitProductsClosingStockData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    await ProductsClosingStockData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    const processedData = processDataForDB(data, userId, entryDate);
    await ProductsClosingStockData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Products closing stock data submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting products closing stock data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getProductsClosingStockDataByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    
    const data = await ProductsClosingStockData.findAll({
      where: {
        user_id: userId,
        entry_date: date
      },
      order: [['id', 'ASC']]
    });
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching products closing stock data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Waiting Tanker Data Controllers
const saveWaitingTankerData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    await WaitingTankerData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    const processedData = processDataForDB(data, userId, entryDate);
    await WaitingTankerData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Waiting tanker data saved successfully'
    });
  } catch (error) {
    console.error('Error saving waiting tanker data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const submitWaitingTankerData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    await WaitingTankerData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    const processedData = processDataForDB(data, userId, entryDate);
    await WaitingTankerData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Waiting tanker data submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting waiting tanker data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getWaitingTankerDataByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    
    const data = await WaitingTankerData.findAll({
      where: {
        user_id: userId,
        entry_date: date
      },
      order: [['id', 'ASC']]
    });
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching waiting tanker data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Third Party Procurement Data Controllers
const saveThirdPartyProcurementData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    await ThirdPartyProcurementData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    const processedData = processDataForDB(data, userId, entryDate);
    await ThirdPartyProcurementData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Third party procurement data saved successfully'
    });
  } catch (error) {
    console.error('Error saving third party procurement data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const submitThirdPartyProcurementData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    validateData(data);
    
    await ThirdPartyProcurementData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    const processedData = processDataForDB(data, userId, entryDate);
    await ThirdPartyProcurementData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Third party procurement data submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting third party procurement data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getThirdPartyProcurementDataByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    
    const data = await ThirdPartyProcurementData.findAll({
      where: {
        user_id: userId,
        entry_date: date
      },
      order: [['id', 'ASC']]
    });
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching third party procurement data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Opening Stock Data Controllers
const saveOpeningStockData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    // Delete existing data for this date and user
    await OpeningStockData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    // Process and insert new data
    const processedData = processOpeningStockDataForDB(data, userId, entryDate);
    await OpeningStockData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Opening stock data saved successfully'
    });
  } catch (error) {
    console.error('Error saving opening stock data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const submitOpeningStockData = async (req, res) => {
  try {
    const { data, entryDate } = req.body;
    const userId = req.user.id;
    
    // Delete existing data for this date and user
    await OpeningStockData.destroy({
      where: {
        user_id: userId,
        entry_date: entryDate
      }
    });
    
    // Process and insert new data
    const processedData = processOpeningStockDataForDB(data, userId, entryDate);
    await OpeningStockData.bulkCreate(processedData);
    
    res.json({
      success: true,
      message: 'Opening stock data submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting opening stock data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getOpeningStockDataByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    
    const data = await OpeningStockData.findAll({
      where: {
        user_id: userId,
        entry_date: date
      },
      order: [['section', 'ASC'], ['id', 'ASC']]
    });
    
    // Group data by section
    const groupedData = {
      openingStockData: data.filter(item => item.section === 'opening_stock'),
      tankerData: data.filter(item => item.section === 'tanker_transaction'),
      procurementData: data.filter(item => item.section === 'own_procurement')
    };
    
    res.json({
      success: true,
      data: groupedData
    });
  } catch (error) {
    console.error('Error fetching opening stock data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Daily Reports Controller
const getDailyReport = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    
    // Fetch all data for the specified date
    const [
      salesData,
      otherDairySalesData,
      productsData,
      siloClosingBalanceData,
      productsClosingStockData,
      waitingTankerData,
      thirdPartyProcurementData,
      openingStockData
    ] = await Promise.all([
      SalesData.findAll({
        where: { user_id: userId, entry_date: date },
        include: [{ model: User, as: 'user', attributes: ['username'] }]
      }),
      OtherDairySalesData.findAll({
        where: { user_id: userId, entry_date: date },
        include: [{ model: User, as: 'user', attributes: ['username'] }]
      }),
      ProductsData.findAll({
        where: { user_id: userId, entry_date: date },
        include: [{ model: User, as: 'user', attributes: ['username'] }]
      }),
      SiloClosingBalanceData.findAll({
        where: { user_id: userId, entry_date: date },
        include: [{ model: User, as: 'user', attributes: ['username'] }]
      }),
      ProductsClosingStockData.findAll({
        where: { user_id: userId, entry_date: date },
        include: [{ model: User, as: 'user', attributes: ['username'] }]
      }),
      WaitingTankerData.findAll({
        where: { user_id: userId, entry_date: date },
        include: [{ model: User, as: 'user', attributes: ['username'] }]
      }),
      ThirdPartyProcurementData.findAll({
        where: { user_id: userId, entry_date: date },
        include: [{ model: User, as: 'user', attributes: ['username'] }]
      }),
      OpeningStockData.findAll({
        where: { user_id: userId, entry_date: date },
        include: [{ model: User, as: 'user', attributes: ['username'] }]
      })
    ]);
    
    res.json({
      success: true,
      data: {
        date,
        salesData,
        otherDairySalesData,
        productsData,
        siloClosingBalanceData,
        productsClosingStockData,
        waitingTankerData,
        thirdPartyProcurementData,
        openingStockData
      }
    });
  } catch (error) {
    console.error('Error fetching daily report:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  // Sales Data
  saveSalesData,
  submitSalesData,
  getSalesDataByDate,
  
  // Other Dairy Sales Data
  saveOtherDairySalesData,
  submitOtherDairySalesData,
  getOtherDairySalesDataByDate,
  
  // Products Data
  saveProductsData,
  submitProductsData,
  getProductsDataByDate,
  
  // Silo Closing Balance Data
  saveSiloClosingBalanceData,
  submitSiloClosingBalanceData,
  getSiloClosingBalanceDataByDate,
  
  // Products Closing Stock Data
  saveProductsClosingStockData,
  submitProductsClosingStockData,
  getProductsClosingStockDataByDate,
  
  // Waiting Tanker Data
  saveWaitingTankerData,
  submitWaitingTankerData,
  getWaitingTankerDataByDate,
  
  // Third Party Procurement Data
  saveThirdPartyProcurementData,
  submitThirdPartyProcurementData,
  getThirdPartyProcurementDataByDate,
  
  // Opening Stock Data
  saveOpeningStockData,
  submitOpeningStockData,
  getOpeningStockDataByDate,
  
  // Daily Reports
  getDailyReport
};
