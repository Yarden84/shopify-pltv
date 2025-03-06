const fs = require('fs');
const { getShopifyOrders } = require('../services/shopifyService');

const TOKEN_FILE = 'shopify_credentials.json';

const getOrders = async (req, res) => {
    try {
        if (!fs.existsSync(TOKEN_FILE)) {
            return res.status(400).json({ error: 'Access token not found. Get the token first.' });
        }

        const tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));

        if (!tokenData.access_token) {
            return res.status(400).json({ error: 'Invalid token data.' });
        }

        const { access_token } = tokenData;
        const { storeName } = req.query;

        if (!storeName) {
            return res.status(400).json({ error: 'Missing storeName parameter.' });
        }

        const ordersData = await getShopifyOrders(storeName, access_token);
        res.json(ordersData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

module.exports = { getOrders };
