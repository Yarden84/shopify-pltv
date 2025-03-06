require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { apiRoutes } = require('./routes/apiRoutes');
// const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use routes
app.use('/api', apiRoutes);

// Error handling middleware
// app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});