const Task = require('../models/taskModel');

// calculate the end time of a task based on its start time and duration.
const calculateEndTime = (startTime, duration) => {
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + duration);
    return endTime;
};

// Main scheduling function
const getScheduledTasks = async () => {
    // Fetch Pending Tasks
    const tasks = await Task.find({ status: 'PENDING' }).exec();

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

    // Assign start and end times to each task
    tasks.forEach(task => {
        let earliestStartTime = new Date();

        // checking dependencies to ensure that a task starts only after all its dependencies have been completed.
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
