// array containing all completed tasks, each task is an object with task id
const mongoose = require('mongoose');

const completedTaskSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', unique: true }
});

const CompletedTask = mongoose.model('CompletedTask', completedTaskSchema);

module.exports = CompletedTask;
