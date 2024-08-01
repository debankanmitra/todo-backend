const Task = require("../models/taskModel");
const { STATUS } = require("../utils/enums");

const Validate = async (task) => {
	// Iterate over each dependency in the current task
	for (let depId of task.dependencies) {
		// Fetch the subtask referenced by depId
		const subtask = await Task.findById(depId).exec();
		if (!subtask) {
			throw new Error(`Subtask with ID ${depId} not found`);
		}

		// Check if the current task ID is in the dependencies of the subtask
		if (subtask.dependencies.includes(task._id)) {
			throw new Error("Cyclic dependency detected");
		}
	}

	return true;
};

const CheckCompletion = async (dependencies) => {
	for (let dep of dependencies) {
		const subtask = await Task.findById(dep).exec();
		if (subtask.status !== STATUS.COMPLETED) {
			return false;
		}
	}
	return true;
};

module.exports = {
	Validate,
	CheckCompletion,
};
