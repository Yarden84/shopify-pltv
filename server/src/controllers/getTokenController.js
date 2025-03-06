const fs = require('fs');
const { getShopifyAccessToken } = require('../services/shopifyService');

const TOKEN_FILE = 'shopify_credentials.json';

const getShopifyToken = async (req, res) => {
    try {
        const { storeName, code } = req.body;

        if (!storeName || !code) {
            return res.status(400).json({ error: 'Missing storeName or data' });
        }

        const tokens = [];
        
        if (fs.existsSync(TOKEN_FILE)) {
            const fileContent = fs.readFileSync(TOKEN_FILE, 'utf8').trim();
            
            if (fileContent.data) {
                const shopifyCredentials = JSON.parse(fileContent)
                tokens.push(shopifyCredentials.data);
            }
        }   

        const storeExists = tokens.length !== 0 && tokens.map(token => token.store).indexOf(storeName) !== -1;

        if (!storeExists) {
            const tokenData = await getShopifyAccessToken(storeName, code);
            tokens.push({ store: storeName, ...tokenData });
            fs.writeFileSync(TOKEN_FILE, JSON.stringify({ data: tokens }));
            res.json(tokenData);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to get Shopify token' });
    }
};

module.exports = { getShopifyToken };