const Task = require("../models/taskModel");
const validationService = require("../services/validationService");
const PriorityService = require("../services/PriorityService");
const schedulingService = require("../services/schedulingService");
const notificationService = require("../services/notificationService");
const CompletedTask = require("../models/completedTaskModel");

const getAllTasks = async (req, res, next) => {
	try {
		data = [];
		const tasks = await Task.find();

		// Dynamically calculating priority for each task
		for (let task of tasks) {
			score = await PriorityService.CalculatePriorityScore(task);
			data.push({
				task,
				priority: score,
			});
		}

		// Sorting the tasks based on priority
		data.sort((a, b) => {
			return a.priority - b.priority;
		});
		res.json(data);
	} catch (error) {
		next(error);
	}
};

const createTask = async (req, res, next) => {
	try {
		const {
			title,
			description,
			priority,
			dueDate,
			dependencies,
			estimatedDuration,
		} = req.body;

		const newTask = new Task({
			title,
			description,
			priority,
			dueDate,
			dependencies,
			estimatedDuration,
		});
		await newTask.save();

		res.status(201).json(newTask);
	} catch (error) {
		next(error);
	}
};

const getTaskById = async (req, res, next) => {
	try {
		data = [];
		const task = await Task.findById(req.params.id);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		// Dynamically calculating priority for single task
		score = await PriorityService.CalculatePriorityScore(task);
		data.push({
			task,
			priority: score,
		});
		res.json(data);
	} catch (error) {
		next(error);
	}
};

const updateTask = async (req, res, next) => {
	try {
		const { title, description, priority, dueDate, dependencies, status } =
			req.body;

		// task can only be completed if its dependencies are also completed
		if (
			status === "COMPLETED" &&
			!(await validationService.CheckCompletion(dependencies))
		) {
			return res.status(400).json({
				message:
					"Task cannot be completed because its dependencies are not completed",
			});
		}

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

		// Notify users if the task is marked as COMPLETED
		if (status === "COMPLETED") {
			// Check if this task ID is already in the CompletedTask collection
			const isAlreadyCompleted = await CompletedTask.findOne({
				taskId: task._id,
			}).exec();
			if (!isAlreadyCompleted) {
				// Add the task ID to the CompletedTask collection
				await CompletedTask.create({ taskId: task._id });

				// Notify users about completed task and dependent tasks
				const dependentTask = await Task.find({ dependencies: task._id });
				console.log("dependentTask",dependentTask);
				await notificationService.sendEmail(
					"Task Completed",
					`Task "${task.title}" has been completed. You can now start working on the dependent tasks: ${dependentTask
						.map((task) => task.title)
						.join(", ")}.`
				)
			}
		}
		//----------------Notification----------------
		res.json(task);
	} catch (error) {
		console.error("Error in updateTask:", error);
		next(error); // Pass the error to the next middleware (e.g., error handler)
	}
};

const deleteTask = async (req, res, next) => {
	try {
		const taskId = req.params.id;
		console.log("task id", taskId);
		// Delete the task from the database
		const task = await Task.findByIdAndDelete(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		// Update dependencies of all tasks
		const tasks = await Task.find({ dependencies: taskId });
		for (const task of tasks) {
			const updatedDependencies = task.dependencies;
			updatedDependencies.pop(taskId);
			// console.log("updated dependencies",updatedDependencies);
			task.dependencies = updatedDependencies;
			await task.save();
			// console.log(`Updated task ${task._id} with dependencies: ${task.dependencies}`);
		}

		// Delete the task from the CompletedTask collection
		await CompletedTask.deleteOne({ taskId }).exec();
		console.log("task deleted", taskId);

		res.status(204).json({ message: "Task deleted" });
	} catch (error) {
		next(error);
	}
};

const getScheduledTasks = async (req, res, next) => {
	try {
		const scheduledTasks = await schedulingService.getScheduledTasks();
		// output in a readable format
		scheduledTasks.forEach((task) => {
			task.startTime = new Date(task.startTime).toLocaleString();
			task.endTime = new Date(task.endTime).toLocaleString();
		});

		res.json(scheduledTasks);
	} catch (error) {
		console.error("Error in getScheduledTasks:", error);
		next(error);
	}
};

// FOR EXPERIMENTATION
// const test = async (req, res, next) => {
//     res.json({ message: 'Task controller is working' });
// };

module.exports = {
	getAllTasks,
	createTask,
	getTaskById,
	updateTask,
	deleteTask,
	getScheduledTasks,
	// test
};
