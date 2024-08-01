const Task = require('../models/taskModel');

// Helper function to calculate end time based on start time and duration
const calculateEndTime = (startTime, duration) => {
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + duration);
    return endTime;
};

// Main scheduling function
const getScheduledTasks = async () => {
    const tasks = await Task.find({ status: 'PENDING' }).exec();
    // console.log('Scheduling tasks...', tasks);

    // Sort tasks based on priority and due date
    tasks.sort((a, b) => {
        const priorityOrder = ['HIGH', 'MEDIUM', 'LOW'];
        const priorityComparison = priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
        if (priorityComparison !== 0) {
            return priorityComparison;
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    const scheduledTasks = [];
    const taskMap = new Map();

    // Assign start and end times
    tasks.forEach(task => {
        let earliestStartTime = new Date();

        // Find the earliest possible start time considering dependencies
        task.dependencies.forEach(depId => {
            const depTask = taskMap.get(depId);
            if (depTask && depTask.endTime > earliestStartTime) {
                earliestStartTime = new Date(depTask.endTime);
            }
        });

        // Avoid overlaps by checking scheduled tasks
        for (let scheduledTask of scheduledTasks) {
            if (scheduledTask.endTime > earliestStartTime) {
                earliestStartTime = new Date(scheduledTask.endTime);
            }
        }

        const endTime = calculateEndTime(earliestStartTime, task.estimatedDuration);

        scheduledTasks.push({
            task_id: task._id,
            startTime: earliestStartTime,
            endTime: endTime
        });

        taskMap.set(task._id.toString(), { ...task, startTime: earliestStartTime, endTime: endTime });
    });

    return scheduledTasks;
};

module.exports = {
    getScheduledTasks
};
