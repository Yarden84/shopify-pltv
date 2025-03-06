const fs = require('fs');

const TOKEN_FILE = 'shopify_credentials.json';

const checkShopifyToken = async (req, res) => {
    try {
        if (!fs.existsSync(TOKEN_FILE)) {
            return res.status(200).json({ message: 'false' });
        }

        const { storeName } = req.query;

        if (!storeName) {
            return res.status(400).json({ error: 'Missing storeName parameter.' });
        }

        const shopifyCredentials = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'))
        const tokenData = shopifyCredentials.data;
        const index = tokenData.map(item => item.store).indexOf(storeName);
        const message = index === -1 ? 'false' : 'true';
        
        return res.status(200).json({ message });  
    } catch (error) {
        res.status(500).json({ error: 'Failed to get Shopify token' });
    }
};

module.exports = { checkShopifyToken };