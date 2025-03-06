const fs = require('fs');
const { getShopifyAccessToken } = require('../services/shopifyService');

const TOKEN_FILE = 'shopify_credentials.json';

const getShopifyToken = async (req, res) => {
    try {
        const { storeName, code } = req.body;
        if (!storeName || !code) {
            return res.status(400).json({ error: 'Missing storeName or data' });
        }

        // const oldTokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
        
        // if (oldTokenData.access_token) {
        //     return res.status(400).json({ error: 'Invalid token data.' });
        // }

        const tokenData = await getShopifyAccessToken(storeName, code);
        fs.writeFileSync(TOKEN_FILE, JSON.stringify({...tokenData, store: storeName}));
        res.json(tokenData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get Shopify token' });
    }
};

module.exports = { getShopifyToken };