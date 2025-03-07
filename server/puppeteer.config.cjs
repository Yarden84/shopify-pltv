const { join } = require('path');

// Use a path relative to the project root or adjust based on the environment
const cachePath = process.env.NODE_ENV === 'production' ? '/opt/render/.cache/puppeteer' : join(__dirname, '.cache', 'puppeteer');

/**
* @type {import("puppeteer").Configuration}
*/
module.exports = { cacheDirectory: cachePath };