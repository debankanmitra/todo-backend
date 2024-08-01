const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');


// router.get('/test', taskController.test);


router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
// router.get('/schedule', taskController.getScheduledTasks);


module.exports = router;
