const express = require('express');
const app = express();
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { connectDB } = require('./utils/db');
const cron = require('./cron/notifyUpcomingDeadlines'); // Path to the file containing the cron job


require('dotenv').config();

// Connect to the database
connectDB();

app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the scheduled job
cron;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
