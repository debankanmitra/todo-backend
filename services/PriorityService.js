/**
 * Task Prioritization:✅️
 * User-defined priority
 * Due date proximity
 * Number of dependencies
 */

// Lower the Score of tasks higher will be the priority
const CalculatePriorityScore = async (task) => {
	// Initialize priority score
	PriorityScore = 0;

	// User-defined priority
	if (task.priority == "LOW") {
		PriorityScore += 3;
	} else if (task.priority == "MEDIUM") {
		PriorityScore += 2;
	} else if (task.priority == "HIGH") {
		PriorityScore += 1;
	}

	// Due date proximity (closer the duedate is, higher the score will be)
	const currentDate = new Date();
	const dueDate = new Date(task.dueDate);

	// Format the date as yyyy-mm-dd
	const formattedDate = new Date(dueDate.toISOString().split("T")[0]);

	// Calculate the difference in milliseconds
	const timeDifference = formattedDate - currentDate;

	// Convert milliseconds to days
	const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

	if (daysDifference > 0) {
		PriorityScore += daysDifference;
	} else {
		PriorityScore += 0;
	}

	// Number of dependencies , smaller the number of dependencies, higher the score
	const dependencyScore = task.dependencies.length;
	PriorityScore += dependencyScore;

	return PriorityScore;
};

module.exports = {
	CalculatePriorityScore,
};
