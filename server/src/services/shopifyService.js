const axios = require('axios');
require('dotenv').config();

const getShopifyAccessToken = async (storeName, code) => {
    const shopifyUrl = `https://${storeName}.myshopify.com/admin/oauth/access_token`;
    const requestData = {
        client_id: process.env.API_KEY,
        client_secret: process.env.API_SECRET,
        code,
    };

    const response = await axios.post(shopifyUrl, requestData, {
        headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
};


const getShopifyOrders = async (storeName, accessToken) => {
    const shopifyOrdersUrl = `https://${storeName}.myshopify.com/admin/api/2024-01/orders.json`;

    const response = await axios.get(shopifyOrdersUrl, {
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
        },
    });

    return response.data;
};

module.exports = { getShopifyAccessToken, getShopifyOrders };
