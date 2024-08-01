const cron = require('node-cron');
const Task = require('../models/task');
const notificationService = require('../services/notificationService');

const notifyUpcomingDeadlines = async () => {
  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const tasks = await Task.find({
    dueDate: { $gte: now, $lte: in24Hours },
    status: 'PENDING'
  }).exec();

  tasks.forEach(async (task) => {
    await notificationService.sendEmail(
      task.assignedTo,
      'Task Due Soon',
      `The task "${task.title}" is due within the next 24 hours. Please make sure to complete it on time.`
    );
  });
};

// Schedule the job to run every hour
cron.schedule('0 * * * *', notifyUpcomingDeadlines);
