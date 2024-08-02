const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// router.get('/test', taskController.test);

// Routes

// // Get all tasks
// GET /tasks

// // Create a new task
// POST /tasks

// // Get a specific task by ID
// GET /tasks/:id

// // Update a specific task by ID
// PUT /tasks/:id

// // Delete a specific task by ID
// DELETE /tasks/:id

// // Get the scheduled tasks with start and end times
// GET /tasks/schedule

router.get("/schedule", taskController.getScheduledTasks);
router.get("/", taskController.getAllTasks);
router.post("/", taskController.createTask);
router.get("/:id", taskController.getTaskById);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
