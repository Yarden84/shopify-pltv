const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const TOKEN_FILE = 'shopify_credentials.json';

app.use(cors()); 
app.use(express.json()); 

app.post('/get-shopify-token', async (req, res) => {
    try {
        const { storeName, code } = req.body; 

        if (!storeName, !code) {
            return res.status(400).json({ error: 'Missing storeName or data' });
        }

        const shopifyUrl = `https://${storeName}.myshopify.com/admin/oauth/access_token`;

        const requestData = {
            client_id: process.env.API_KEY, 
            client_secret: process.env.API_SECRET, 
            code,
        };

        const response = await axios.post(shopifyUrl, requestData, {
            headers: { 'Content-Type': 'application/json' },
        });

        fs.writeFileSync(TOKEN_FILE, JSON.stringify(response.data));

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching token:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to get Shopify token' });
    }
});

app.get('/get-orders', async (req, res) => {
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

        const shopifyOrdersUrl = `https://${storeName}.myshopify.com/admin/api/2024-01/orders.json`;

        const response = await axios.get(shopifyOrdersUrl, {
            headers: {
                'X-Shopify-Access-Token': access_token,
                'Content-Type': 'application/json',
            },
        });

        console.log('orders: ', response.data?.orders);

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching orders:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

app.post('/upload-csv', async (req, res) => {
    try {
        const { csv } = req.body;
        if (!csv) {
            return res.status(400).json({ error: 'No CSV text provided' });
        }

        const filePath = path.join(__dirname, 'uploads', 'upload.csv');
        fs.mkdirSync(path.dirname(filePath), { recursive: true }); 
        fs.writeFileSync(filePath, csv);

        console.log('CSV saved successfully:', filePath);

        const uploadSuccess = await uploadCsvToChurney(filePath);
        if (uploadSuccess) {
            res.json({ message: 'CSV uploaded successfully!' });
        } else {
            res.status(500).json({ error: 'CSV upload failed' });
        }
    } catch (error) {
        console.error('Error in upload-csv endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function uploadCsvToChurney(csvFilePath) {
    try {
        const browser = await puppeteer.launch({ headless: false }); 
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        await page.goto('https://churney.io/pltv-impact-explorer/pltv-diagnostics#pltvTool', { waitUntil: 'domcontentloaded' });

        await page.waitForSelector('iframe'); 
        const iframeElement = await page.$('iframe');
        
        const iframe = await iframeElement.contentFrame();

        const inputFileSelector = 'input[type="file"]';
        await iframe.waitForSelector(inputFileSelector);
        const inputFile = await iframe.$(inputFileSelector);

        await inputFile.uploadFile(csvFilePath);

        const analyzeData = await iframe.$('button[data-testid="stBaseButton-primary"]'); 

        setTimeout(async () => {
            await analyzeData.click();
        }, 100);

        console.log('File uploaded successfully!');
        return true;
    } catch (error) {
        console.error('Error uploading CSV:', error);
        return false;
    }
}


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
