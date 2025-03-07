require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { apiRoutes } = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({origin: ['http://localhost:5173', 'https://your-production-frontend.com']}));
app.use(express.json());

app.use('/api', apiRoutes);
//
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});