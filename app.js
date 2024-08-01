const express = require('express');
const app = express();
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { connectDB } = require('./utils/db');

require('dotenv').config();

// Connect to the database
connectDB();

app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
