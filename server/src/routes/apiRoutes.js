const express = require('express');
const router = express.Router();
const { checkShopifyToken } = require('../controllers/checkTokenController');
const { getShopifyToken } = require('../controllers/getTokenController');
const { getOrders } = require('../controllers/getOrdersController');
const { uploadCsv } = require('../controllers/uploadCsvControlles');

router.get('/check-shopify-token', checkShopifyToken);
router.post('/get-shopify-token', getShopifyToken);
router.get('/get-orders', getOrders);
router.post('/upload-csv', uploadCsv);

module.exports = { apiRoutes: router };
