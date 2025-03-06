const puppeteer = require('puppeteer');

const uploadCsvToChurney = async (csvFilePath) => {
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
        }, 1000);

        console.log('File uploaded successfully!');
        return true;
    } catch (error) {
        console.error('Error uploading CSV:', error);
        return false;
    }
};

module.exports = { uploadCsvToChurney };
