const Task = require('../models/taskModel');
const validationService = require('../services/validationService');
const schedulingService = require('../services/schedulingService');
const notificationService = require('../services/notificationService');

const getAllTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
    try {
        const { title, description, priority, dueDate, dependencies } = req.body;
        // validationService.validateTask({ title, description, priority, dueDate, dependencies });

        const newTask = new Task({ title, description, priority, dueDate, dependencies });
        await newTask.save();

        // await schedulingService.scheduleTasks();
        // notificationService.setupNotifications(newTask);

        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
      const { title, description, priority, dueDate, dependencies, status } = req.body;
  
      // Fetch the existing task
      const existingTask = await Task.findById(req.params.id).exec();
      if (!existingTask) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // Create a temporary task object with updated dependencies
      const updatedTask = {
        ...existingTask.toObject(),
        dependencies,
      };
  
      // Validate the updated task for circular dependencies
      await validationService.Validate(updatedTask);
  
      // Update the task in the database
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { title, description, priority, dueDate, dependencies, status },
        { new: true }
      ).exec();
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.json(task);
    } catch (error) {
      console.error("Error in updateTask:", error);
      next(error); // Pass the error to the next middleware (e.g., error handler)
    }
  };

const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // await schedulingService.scheduleTasks();
        // notificationService.cancelNotifications(task);

        res.status(204).json({ message: 'Task deleted' });
    } catch (error) {
        next(error);
    }
};

// const getScheduledTasks = async (req, res, next) => {
//     try {
//         const scheduledTasks = await schedulingService.getScheduledTasks();
//         res.json(scheduledTasks);
//     } catch (error) {
//         next(error);
//     }
// };

// const test = async (req, res, next) => {
//     res.json({ message: 'Task controller is working' });
// };

module.exports = {
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    // getScheduledTasks,
    // test
};
