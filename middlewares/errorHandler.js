const errorHandler = (err, req, res, next) => {
	// console.error('Global Error Handler:', err); // Log the error details

	// Check for specific error (Cyclic dependency)
	if (err.message === "Cyclic dependency detected") {
		return res.status(400).json({ message: err.message });
	}

	// Handle other types of errors
	res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;
