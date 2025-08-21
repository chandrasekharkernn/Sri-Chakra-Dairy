const express = require('express');
const router = express.Router();
const verify_jwt = require('../middleware/verify_jwt');
const dataController = require('../controllers/dataController');

// All routes require authentication
router.use(verify_jwt);

// Sales Data Routes
router.post('/sales/save', dataController.saveSalesData);
router.post('/sales/submit', dataController.submitSalesData);
router.get('/sales/:date', dataController.getSalesDataByDate);

// Other Dairy Sales Data Routes
router.post('/other-dairy-sales/save', dataController.saveOtherDairySalesData);
router.post('/other-dairy-sales/submit', dataController.submitOtherDairySalesData);
router.get('/other-dairy-sales/:date', dataController.getOtherDairySalesDataByDate);

// Products Data Routes
router.post('/products/save', dataController.saveProductsData);
router.post('/products/submit', dataController.submitProductsData);
router.get('/products/:date', dataController.getProductsDataByDate);

// Silo Closing Balance Data Routes
router.post('/silo-closing-balance/save', dataController.saveSiloClosingBalanceData);
router.post('/silo-closing-balance/submit', dataController.submitSiloClosingBalanceData);
router.get('/silo-closing-balance/:date', dataController.getSiloClosingBalanceDataByDate);

// Products Closing Stock Data Routes
router.post('/products-closing-stock/save', dataController.saveProductsClosingStockData);
router.post('/products-closing-stock/submit', dataController.submitProductsClosingStockData);
router.get('/products-closing-stock/:date', dataController.getProductsClosingStockDataByDate);

// Waiting Tanker Data Routes
router.post('/waiting-tanker/save', dataController.saveWaitingTankerData);
router.post('/waiting-tanker/submit', dataController.submitWaitingTankerData);
router.get('/waiting-tanker/:date', dataController.getWaitingTankerDataByDate);

// Third Party Procurement Data Routes
router.post('/third-party-procurement/save', dataController.saveThirdPartyProcurementData);
router.post('/third-party-procurement/submit', dataController.submitThirdPartyProcurementData);
router.get('/third-party-procurement/:date', dataController.getThirdPartyProcurementDataByDate);

// Opening Stock Data Routes
router.post('/opening-stock/save', dataController.saveOpeningStockData);
router.post('/opening-stock/submit', dataController.submitOpeningStockData);
router.get('/opening-stock/:date', dataController.getOpeningStockDataByDate);

// Daily Reports Route (for combining all data)
router.get('/daily-reports/:date', dataController.getDailyReport);

module.exports = router;
