const errorHandler = (err, req, res, next) => {
    // console.error('Global Error Handler:', err); // Log the error details

    // Check for specific error types or messages
    if (err.message === 'Cyclic dependency detected') {
        return res.status(400).json({ message: err.message });
    }

    // Handle other types of errors
    res.status(500).json({ message: 'Internal Server Error' });
};

module.exports = errorHandler;









// const Validate = async (task) => {
//     // Iterate over each dependency in the current task
//     for (let depId of task.dependencies) {
//         // Fetch the subtask referenced by depId
//         const subtask = await Task.findById(depId).exec();
//         if (!subtask) {
//             throw new Error(`Subtask with ID ${depId} not found`);
//         }

//         // Check if the current task ID is in the dependencies of the subtask
//         if (subtask.dependencies.includes(task._id)) {
//             throw new Error('Cyclic dependency detected');
//         }
//     }

//     return true;
// };
