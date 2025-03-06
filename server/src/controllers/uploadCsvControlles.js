const fs = require('fs');
const path = require('path');
const { uploadCsvToChurney } = require('../services/churneyService');

const uploadCsv = async (req, res) => {
    try {
        const { csv } = req.body;
        if (!csv) {
            return res.status(400).json({ error: 'No CSV text provided' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', 'upload.csv');
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, csv);

        const uploadSuccess = await uploadCsvToChurney(filePath);
        if (uploadSuccess) {
            res.json({ message: 'CSV uploaded successfully!' });
        } else {
            res.status(500).json({ error: 'CSV upload failed' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { uploadCsv };
