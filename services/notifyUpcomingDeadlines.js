const cron = require('node-cron');
const Task = require('../models/taskModel');
const notificationService = require('../services/notificationService');

const notifyUpcomingDeadlines = async () => {
  const now = new Date();
  const in24hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const tasks = await Task.find({
    dueDate: { $gte: now, $lte: in24hours },
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


/**
* 0: At minute 0 (the start of the hour).
*: Every hour.
*: Every day of the month.
*: Every month.
*: Every day of the week.
 */

// Schedule the job to run every hour
cron.schedule('0 * * * *', notifyUpcomingDeadlines);
